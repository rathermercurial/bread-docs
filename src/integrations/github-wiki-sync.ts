import type { AstroIntegration } from 'astro';
import { Octokit } from 'octokit';
import fs from 'fs/promises';
import path from 'path';

interface GitHubWikiSyncOptions {
  token: string;
  owner: string;
  repo: string;
  wikiPath: string;
  contentDir: string;
  attachmentsDir: string;
}

/**
 * Astro integration that syncs wiki content from a GitHub repository
 * to the local filesystem for Starlight to process.
 */
export default function githubWikiSync(options: GitHubWikiSyncOptions): AstroIntegration {
  return {
    name: 'github-wiki-sync',
    hooks: {
      'astro:config:done': async ({ logger }) => {
        // Validate configuration
        if (!options.token) {
          logger.error('GITHUB_TOKEN is not set. Please configure your .env file.');
          throw new Error('GITHUB_TOKEN environment variable is required');
        }

        logger.info('Starting GitHub wiki sync...');
        logger.info(`Repository: ${options.owner}/${options.repo}`);
        logger.info(`Wiki path: ${options.wikiPath}`);
        logger.info(`Token configured: ${options.token.substring(0, 8)}...`);

        const octokit = new Octokit({ auth: options.token });

        try {
          // Get the default branch
          const { data: repo } = await octokit.rest.repos.get({
            owner: options.owner,
            repo: options.repo,
          });

          const defaultBranch = repo.default_branch;
          logger.info(`Using branch: ${defaultBranch}`);

          // Get the repository tree
          const { data: tree } = await octokit.rest.git.getTree({
            owner: options.owner,
            repo: options.repo,
            tree_sha: defaultBranch,
            recursive: 'true',
          });

          // Filter for markdown files in the wiki path, excluding readme files
          const wikiFiles = tree.tree.filter((item) => {
            if (item.type !== 'blob' || !item.path) return false;
            if (!item.path.startsWith(options.wikiPath + '/')) return false;
            if (!item.path.endsWith('.md')) return false;

            // Exclude readme files (case-insensitive)
            const filename = item.path.split('/').pop()?.toLowerCase();
            if (filename === 'readme.md') {
              logger.info(`Skipping readme file: ${item.path}`);
              return false;
            }

            return true;
          });

          logger.info(`Found ${wikiFiles.length} wiki files`);

          // Create wiki directory in content
          const wikiContentDir = path.join(process.cwd(), options.contentDir, 'wiki');
          await fs.mkdir(wikiContentDir, { recursive: true });

          // Track all image references across all files
          const allImageReferences = new Set<string>();
          let syncedCount = 0;
          let skippedCount = 0;

          // Download each markdown file
          for (const file of wikiFiles) {
            if (!file.path || !file.sha) continue;

            // Get file content
            const { data: content } = await octokit.rest.git.getBlob({
              owner: options.owner,
              repo: options.repo,
              file_sha: file.sha,
            });

            // Decode base64 content
            const markdown = Buffer.from(content.content, 'base64').toString('utf-8');

            // Extract the relative path within wiki/
            const relativePath = file.path.substring(options.wikiPath.length + 1);

            // Validate against Starlight schema
            const validation = validateStarlightSchema(markdown, relativePath);
            if (!validation.valid) {
              logger.warn(`Skipping invalid file: ${relativePath}`);
              validation.errors.forEach((error) => logger.warn(`  - ${error}`));
              skippedCount++;
              continue;
            }

            const outputPath = path.join(wikiContentDir, relativePath);

            // Create subdirectories if needed
            await fs.mkdir(path.dirname(outputPath), { recursive: true });

            // Write the markdown file
            await fs.writeFile(outputPath, markdown, 'utf-8');
            logger.info(`Synced: ${relativePath}`);
            syncedCount++;

            // Extract image references from this file
            const images = extractImageReferences(markdown);
            images.forEach((img) => allImageReferences.add(img));
          }

          logger.info(
            `Sync summary: ${syncedCount} files synced, ${skippedCount} files skipped`
          );
          logger.info(`Extracted ${allImageReferences.size} unique image references`);

          // Download attachments
          if (allImageReferences.size > 0) {
            await downloadAttachments(
              octokit,
              options.owner,
              options.repo,
              defaultBranch,
              Array.from(allImageReferences),
              options.attachmentsDir,
              logger
            );
          }

          logger.info('GitHub wiki sync completed successfully');
        } catch (error) {
          logger.error('Failed to sync wiki from GitHub:');
          if (error instanceof Error) {
            logger.error(error.message);

            // Provide helpful troubleshooting tips
            if (error.message.includes('Not Found')) {
              logger.error('');
              logger.error('Troubleshooting tips:');
              logger.error('1. Verify the GITHUB_TOKEN in your .env file has access to the repository');
              logger.error('2. Confirm the repository owner and name are correct');
              logger.error('3. Check that the token has not expired');
              logger.error('4. Ensure the token has "repo" scope for private repositories');
            }
          }
          throw error;
        }
      },
    },
  };
}

/**
 * Parse frontmatter from markdown content
 * Returns { frontmatter, content, hasFrontmatter }
 */
function parseFrontmatter(markdown: string): {
  frontmatter: Record<string, any>;
  content: string;
  hasFrontmatter: boolean;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content: markdown, hasFrontmatter: false };
  }

  const frontmatterText = match[1];
  const content = match[2];

  // Simple YAML parsing for key-value pairs
  const frontmatter: Record<string, any> = {};
  const lines = frontmatterText.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  }

  return { frontmatter, content, hasFrontmatter: true };
}

/**
 * Validate that markdown content has required Starlight schema fields
 * Returns { valid: boolean, errors: string[] }
 */
function validateStarlightSchema(
  markdown: string,
  filename: string
): { valid: boolean; errors: string[] } {
  const { frontmatter, hasFrontmatter } = parseFrontmatter(markdown);
  const errors: string[] = [];

  // Starlight requires a title field
  if (!hasFrontmatter) {
    errors.push('Missing frontmatter block (needs --- at start and end)');
  }

  if (!frontmatter.title) {
    errors.push('Missing required field: title');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Extract image references from markdown content
 * Handles both wikilinks (![[image.png]]) and standard markdown (![](image.png))
 */
function extractImageReferences(markdown: string): string[] {
  const images = new Set<string>();

  // Match wikilink image embeds: ![[image.png]] or ![[folder/image.png]]
  const wikiPattern = /!\[\[([^\]|]+?)(?:\|[^\]]*)?\]\]/g;
  let match;

  while ((match = wikiPattern.exec(markdown)) !== null) {
    const imagePath = match[1].trim();
    // Extract just the filename (in case there's a path)
    const filename = imagePath.split('/').pop();
    if (filename && isImageFile(filename)) {
      images.add(imagePath);
    }
  }

  // Match standard markdown images: ![alt](path/image.png)
  const mdPattern = /!\[([^\]]*)\]\(([^)]+)\)/g;

  while ((match = mdPattern.exec(markdown)) !== null) {
    const imagePath = match[2].trim();
    // Only process if it looks like a local file (not a URL)
    if (!imagePath.startsWith('http://') && !imagePath.startsWith('https://')) {
      const filename = imagePath.split('/').pop();
      if (filename && isImageFile(filename)) {
        images.add(imagePath);
      }
    }
  }

  return Array.from(images);
}

/**
 * Check if a filename is an image based on extension
 */
function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'apng', 'bmp', 'ico'];
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext ? imageExtensions.includes(ext) : false;
}

/**
 * Download attachments from GitHub repository to local filesystem
 */
async function downloadAttachments(
  octokit: Octokit,
  owner: string,
  repo: string,
  branch: string,
  imageReferences: string[],
  attachmentsDir: string,
  logger: any
): Promise<void> {
  // Create attachments directory
  const attachmentsPath = path.join(process.cwd(), attachmentsDir);
  await fs.mkdir(attachmentsPath, { recursive: true });

  logger.info(`Downloading ${imageReferences.length} attachments...`);

  // Try to find each image in common attachment locations
  const searchPaths = ['attachments', 'assets', 'images', '.attachments'];

  for (const imageRef of imageReferences) {
    const filename = imageRef.split('/').pop()!;
    let downloaded = false;

    // If the image reference includes a path, try that first
    if (imageRef.includes('/')) {
      try {
        const { data } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: imageRef,
          ref: branch,
        });

        if ('content' in data) {
          const imageBuffer = Buffer.from(data.content, 'base64');
          await fs.writeFile(path.join(attachmentsPath, filename), imageBuffer);
          logger.info(`Downloaded: ${filename} (from ${imageRef})`);
          downloaded = true;
        }
      } catch (error) {
        // Continue to try other paths
      }
    }

    // If not found yet, search in common attachment directories
    if (!downloaded) {
      for (const searchPath of searchPaths) {
        try {
          const filePath = `${searchPath}/${filename}`;
          const { data } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: filePath,
            ref: branch,
          });

          if ('content' in data) {
            const imageBuffer = Buffer.from(data.content, 'base64');
            await fs.writeFile(path.join(attachmentsPath, filename), imageBuffer);
            logger.info(`Downloaded: ${filename} (from ${filePath})`);
            downloaded = true;
            break;
          }
        } catch (error) {
          // Continue searching
        }
      }
    }

    if (!downloaded) {
      logger.warn(`Could not find attachment: ${imageRef}`);
    }
  }

  logger.info('Attachment download completed');
}
