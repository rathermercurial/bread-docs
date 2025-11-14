import { Octokit } from 'octokit';
import type { Loader, LoaderContext } from 'astro/loaders';
import type { ZodSchema } from 'astro/zod';
import matter from 'gray-matter';

/**
 * Base data entry that all collection items must extend
 */
export interface BaseDataEntry {
  id: string;
  [key: string]: unknown;
}

/**
 * Enrichment plugin interface - allows adding data from external sources
 * Plugins are executed in order and can modify the entry data
 */
export interface EnrichmentPlugin<T extends BaseDataEntry = BaseDataEntry> {
  name: string;
  enabled: boolean;

  /**
   * Enrich a single entry with additional data
   * @param entry The entry to enrich
   * @param context Additional context (octokit, logger, etc.)
   * @returns Modified entry with enriched data
   */
  enrich(entry: T, context: EnrichmentContext): Promise<T>;

  /**
   * Optional batch enrichment for efficiency (e.g., single API call for all entries)
   * If not implemented, individual enrich() will be called for each entry
   */
  enrichBatch?(entries: T[], context: EnrichmentContext): Promise<T[]>;
}

/**
 * Context passed to enrichment plugins
 */
export interface EnrichmentContext {
  octokit: Octokit;
  logger: LoaderContext['logger'];
  cache: Map<string, unknown>;
  config: Record<string, unknown>;
}

/**
 * Parser function to convert raw file content into a data entry
 */
export type DataParser<T extends BaseDataEntry> = (
  content: string,
  filePath: string
) => T | null;

/**
 * Options for creating a GitHub data loader
 */
export interface GitHubDataLoaderOptions<T extends BaseDataEntry> {
  // GitHub configuration
  owner: string;
  repo: string;
  token: string;
  path: string; // Path in the repo (e.g., 'data/organizations')
  branch?: string;

  // File parsing
  pattern?: string; // File pattern to match (e.g., '*.json', '*.md')
  parser: DataParser<T>;

  // Enrichment (optional)
  enrichmentPlugins?: EnrichmentPlugin<T>[];

  // Caching
  cacheKey?: string; // Unique key for this loader's cache
}

/**
 * Create a loader that fetches data from a GitHub repository directory
 * with support for enrichment plugins
 *
 * This is the base loader that can be configured for any data collection.
 *
 * Example usage:
 * ```ts
 * const organizationsLoader = createGitHubDataLoader({
 *   owner: 'BreadchainCoop',
 *   repo: 'shared-obsidian',
 *   path: 'data/organizations',
 *   token: env.GITHUB_TOKEN,
 *   parser: parseOrganizationFile,
 *   enrichmentPlugins: [ensEnrichment, hatsEnrichment],
 * });
 * ```
 */
export function createGitHubDataLoader<T extends BaseDataEntry>(
  options: GitHubDataLoaderOptions<T>
): Loader {
  return {
    name: `github-data-loader:${options.path}`,

    async load(context: LoaderContext): Promise<void> {
      const { store, logger, parseData, generateDigest } = context;

      logger.info(`Loading data from GitHub: ${options.owner}/${options.repo}/${options.path}`);

      // Initialize GitHub client
      const octokit = new Octokit({ auth: options.token });

      try {
        // Get the default branch if not specified
        let branch = options.branch;
        if (!branch) {
          const { data: repo } = await octokit.rest.repos.get({
            owner: options.owner,
            repo: options.repo,
          });
          branch = repo.default_branch;
        }

        logger.info(`Using branch: ${branch}`);

        // Get the repository tree
        const { data: tree } = await octokit.rest.git.getTree({
          owner: options.owner,
          repo: options.repo,
          tree_sha: branch,
          recursive: 'true',
        });

        // Filter files based on path and pattern
        const pattern = options.pattern || '*';
        const targetPath = options.path.endsWith('/') ? options.path : `${options.path}/`;

        const dataFiles = tree.tree.filter((item) => {
          if (item.type !== 'blob' || !item.path) return false;
          if (!item.path.startsWith(targetPath)) return false;

          // Apply pattern matching
          if (pattern !== '*') {
            const filename = item.path.split('/').pop() || '';
            const patternRegex = new RegExp(
              pattern.replace(/\*/g, '.*').replace(/\?/g, '.')
            );
            if (!patternRegex.test(filename)) return false;
          }

          return true;
        });

        logger.info(`Found ${dataFiles.length} files matching pattern`);

        // Fetch and parse each file
        const entries: T[] = [];

        for (const file of dataFiles) {
          if (!file.path || !file.sha) continue;

          try {
            // Fetch file content
            const { data: blob } = await octokit.rest.git.getBlob({
              owner: options.owner,
              repo: options.repo,
              file_sha: file.sha,
            });

            const content = Buffer.from(blob.content, 'base64').toString('utf-8');

            // Parse file using provided parser
            const entry = options.parser(content, file.path);

            if (entry) {
              entries.push(entry);
              logger.info(`Parsed: ${file.path} → ${entry.id}`);
            } else {
              logger.warn(`Failed to parse: ${file.path}`);
            }
          } catch (error) {
            logger.error(`Error processing ${file.path}: ${error}`);
          }
        }

        logger.info(`Parsed ${entries.length} entries`);

        // Apply enrichment plugins if configured
        const enrichedEntries = await applyEnrichmentPlugins(
          entries,
          options.enrichmentPlugins || [],
          {
            octokit,
            logger,
            cache: new Map(),
            config: {},
          }
        );

        // Store entries in Astro's content layer
        store.clear();
        for (const entry of enrichedEntries) {
          store.set({
            id: entry.id,
            data: entry,
          });
        }

        logger.info(`Loaded ${enrichedEntries.length} entries into collection`);
      } catch (error) {
        logger.error(`Failed to load data from GitHub: ${error}`);
        throw error;
      }
    },
  };
}

/**
 * Apply enrichment plugins to a batch of entries
 */
async function applyEnrichmentPlugins<T extends BaseDataEntry>(
  entries: T[],
  plugins: EnrichmentPlugin<T>[],
  context: EnrichmentContext
): Promise<T[]> {
  const { logger } = context;

  // Filter to enabled plugins only
  const enabledPlugins = plugins.filter((p) => p.enabled);

  if (enabledPlugins.length === 0) {
    logger.info('No enrichment plugins enabled');
    return entries;
  }

  logger.info(`Applying ${enabledPlugins.length} enrichment plugins`);

  let enrichedEntries = entries;

  // Apply each plugin in sequence
  for (const plugin of enabledPlugins) {
    logger.info(`Enrichment plugin: ${plugin.name}`);

    try {
      // Use batch enrichment if available (more efficient)
      if (plugin.enrichBatch) {
        enrichedEntries = await plugin.enrichBatch(enrichedEntries, context);
        logger.info(`  ✓ Batch enriched ${enrichedEntries.length} entries`);
      } else {
        // Fall back to individual enrichment
        const results: T[] = [];
        for (const entry of enrichedEntries) {
          const enriched = await plugin.enrich(entry, context);
          results.push(enriched);
        }
        enrichedEntries = results;
        logger.info(`  ✓ Enriched ${enrichedEntries.length} entries individually`);
      }
    } catch (error) {
      logger.error(`  ✗ Plugin ${plugin.name} failed: ${error}`);
      // Continue with other plugins even if one fails
    }
  }

  return enrichedEntries;
}

/**
 * Built-in parser for JSON files
 */
export function parseJsonFile<T extends BaseDataEntry>(
  content: string,
  filePath: string
): T | null {
  try {
    const data = JSON.parse(content);

    // Handle both single objects and arrays
    if (Array.isArray(data)) {
      // For array files, we can't parse multiple entries at once
      // The caller should handle this differently
      throw new Error('Array JSON files not supported by parseJsonFile - use a custom parser');
    }

    // Ensure the object has an id field
    if (!data.id) {
      // Use filename as id if not present
      const filename = filePath.split('/').pop()?.replace(/\.[^.]+$/, '') || 'unknown';
      data.id = filename;
    }

    return data as T;
  } catch (error) {
    console.error(`Failed to parse JSON file ${filePath}:`, error);
    return null;
  }
}

/**
 * Built-in parser for Markdown files with frontmatter
 */
export function parseMarkdownFile<T extends BaseDataEntry>(
  content: string,
  filePath: string
): T | null {
  try {
    const { data, content: markdownContent } = matter(content);

    // Ensure the object has an id field
    if (!data.id) {
      // Use filename as id if not present
      const filename = filePath.split('/').pop()?.replace(/\.[^.]+$/, '') || 'unknown';
      data.id = filename;
    }

    // Include the markdown content in the data
    return {
      ...data,
      content: markdownContent,
    } as T;
  } catch (error) {
    console.error(`Failed to parse Markdown file ${filePath}:`, error);
    return null;
  }
}

/**
 * Built-in parser for YAML files
 * Uses the js-yaml package
 */
export function parseYamlFile<T extends BaseDataEntry>(
  content: string,
  filePath: string
): T | null {
  try {
    // Dynamic import of js-yaml package
    const yaml = require('js-yaml');
    const data = yaml.load(content);

    // Ensure the object has an id field
    if (!data.id) {
      const filename = filePath.split('/').pop()?.replace(/\.[^.]+$/, '') || 'unknown';
      data.id = filename;
    }

    return data as T;
  } catch (error) {
    console.error(`Failed to parse YAML file ${filePath}:`, error);
    return null;
  }
}
