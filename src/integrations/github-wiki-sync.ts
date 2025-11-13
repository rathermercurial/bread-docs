import type { AstroIntegration } from 'astro';
import { Octokit } from 'octokit';
import fs from 'fs/promises';
import path from 'path';
import { loadCache, saveCache, fileExists } from '../lib/github-cache.js';
import { isImageFile } from '../lib/markdown-utils.js';

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
      'astro:config:done': async ({ logger, config }) => {
        // Only sync during builds, not during dev/preview
        const isDevMode = process.argv.includes('dev') || process.argv.includes('preview');

        if (isDevMode) {
          logger.info('Dev/preview mode detected - skipping GitHub sync');
          logger.info('Content will be synced on next build');
          return;
        }

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

          // Load cache
          const cache = await loadCache();

          // Get current commit SHA for caching
          const { data: commit } = await octokit.rest.repos.getCommit({
            owner: options.owner,
            repo: options.repo,
            ref: defaultBranch,
          });

          const currentRepoSha = commit.sha;

          // Fast path: Repository unchanged since last sync
          if (cache.repositorySha === currentRepoSha) {
            logger.info('Repository SHA unchanged since last sync');

            // Verify all cached files still exist locally
            const fileChecks = await Promise.all(
              Object.values(cache.files).map((f) => fileExists(f.localPath))
            );

            const attachmentChecks = await Promise.all(
              Object.values(cache.attachments).map((a) => fileExists(a.localPath))
            );

            if (fileChecks.every(Boolean) && attachmentChecks.every(Boolean)) {
              logger.info(
                `All ${fileChecks.length} files and ${attachmentChecks.length} attachments present - skipping sync`
              );
              return; // EXIT - No sync needed!
            }

            logger.warn('Some cached files missing, performing sync');
          }

          // Get the repository tree
          const { data: tree } = await octokit.rest.git.getTree({
            owner: options.owner,
            repo: options.repo,
            tree_sha: defaultBranch,
            recursive: 'true',
          });

          // Build attachment index from tree (Option D)
          const attachmentIndex = new Map<string, { path: string; sha: string }>();
          const duplicateImages = new Map<string, string[]>();

          for (const item of tree.tree) {
            if (item.type === 'blob' && item.path && isImageFile(item.path)) {
              const filename = item.path.split('/').pop()!;

              // Track duplicates
              if (attachmentIndex.has(filename)) {
                const existing = attachmentIndex.get(filename)!;
                if (!duplicateImages.has(filename)) {
                  duplicateImages.set(filename, [existing.path]);
                }
                duplicateImages.get(filename)!.push(item.path);
              }

              // Store in index (last one wins if duplicates)
              attachmentIndex.set(filename, {
                path: item.path,
                sha: item.sha!,
              });
            }
          }

          // Warn about duplicates
          for (const [filename, paths] of duplicateImages) {
            logger.warn(`Duplicate image filename: ${filename}`);
            paths.forEach((p) => logger.warn(`  - ${p}`));
          }

          logger.info(`Indexed ${attachmentIndex.size} attachments in repository`);

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

          // Create content directory
          const contentDir = path.join(process.cwd(), options.contentDir);
          await fs.mkdir(contentDir, { recursive: true });

          // Track all image references across all files
          const allImageReferences = new Set<string>();

          // Download each markdown file with file-level caching
          let syncedCount = 0;
          let cachedCount = 0;

          for (const file of wikiFiles) {
            if (!file.path || !file.sha) continue;

            const relativePath = file.path.substring(options.wikiPath.length + 1);
            const outputPath = path.join(contentDir, relativePath);

            // Check cache
            const cached = cache.files[relativePath];

            if (cached && cached.sha === file.sha) {
              // File unchanged
              if (await fileExists(cached.localPath)) {
                logger.info(`Cached: ${relativePath}`);
                cachedCount++;

                // Still need to extract image references for later
                const markdown = await fs.readFile(cached.localPath, 'utf-8');
                const images = extractImageReferences(markdown);
                images.forEach((img) => allImageReferences.add(img));

                continue; // Skip download
              }
            }

            // File is new or changed - download it
            logger.info(`Syncing: ${relativePath}`);

            const { data: content } = await octokit.rest.git.getBlob({
              owner: options.owner,
              repo: options.repo,
              file_sha: file.sha,
            });

            const markdown = Buffer.from(content.content, 'base64').toString('utf-8');

            // Create subdirectories if needed
            await fs.mkdir(path.dirname(outputPath), { recursive: true });

            // Write the markdown file
            await fs.writeFile(outputPath, markdown, 'utf-8');
            syncedCount++;

            // Update cache entry
            cache.files[relativePath] = {
              sha: file.sha,
              syncedAt: new Date().toISOString(),
              localPath: outputPath,
            };

            // Extract image references from this file
            const images = extractImageReferences(markdown);
            images.forEach((img) => allImageReferences.add(img));
          }

          logger.info(`Files: ${syncedCount} synced, ${cachedCount} cached`);

          // Clean up deleted files
          const currentPaths = new Set(
            wikiFiles.map((f) => f.path!.substring(options.wikiPath.length + 1))
          );

          for (const [cachedPath, cachedFile] of Object.entries(cache.files)) {
            if (!currentPaths.has(cachedPath)) {
              logger.info(`Removing deleted file: ${cachedPath}`);
              await fs.unlink(cachedFile.localPath).catch(() => {});
              delete cache.files[cachedPath];
            }
          }

          logger.info(`Extracted ${allImageReferences.size} unique image references`);

          // Download attachments using tree index
          const attachmentsPath = path.join(process.cwd(), options.attachmentsDir);
          await fs.mkdir(attachmentsPath, { recursive: true });

          let attachmentsSynced = 0;
          let attachmentsCached = 0;

          for (const imageName of allImageReferences) {
            const localPath = path.join(attachmentsPath, imageName);
            const imageInfo = attachmentIndex.get(imageName);

            if (!imageInfo) {
              logger.warn(`Image not found in repository: ${imageName}`);
              continue;
            }

            // Check cache
            const cached = cache.attachments[imageName];

            if (cached && cached.sha === imageInfo.sha) {
              if (await fileExists(cached.localPath)) {
                logger.info(`Cached attachment: ${imageName}`);
                attachmentsCached++;
                continue; // Skip download
              }
            }

            // Download attachment
            logger.info(`Downloading: ${imageName} (from ${imageInfo.path})`);

            const { data: content } = await octokit.rest.repos.getContent({
              owner: options.owner,
              repo: options.repo,
              path: imageInfo.path,
              ref: defaultBranch,
            });

            if ('content' in content) {
              const imageBuffer = Buffer.from(content.content, 'base64');
              await fs.writeFile(localPath, imageBuffer);
              attachmentsSynced++;

              // Update cache
              cache.attachments[imageName] = {
                sha: imageInfo.sha,
                sourceUrl: imageInfo.path,
                syncedAt: new Date().toISOString(),
                localPath: localPath,
                referencedBy: [], // Will be populated below
              };
            }
          }

          logger.info(`Attachments: ${attachmentsSynced} synced, ${attachmentsCached} cached`);

          // Clean up unreferenced attachments
          for (const [imageName, cached] of Object.entries(cache.attachments)) {
            if (!allImageReferences.has(imageName)) {
              logger.info(`Removing unreferenced attachment: ${imageName}`);
              await fs.unlink(cached.localPath).catch(() => {});
              delete cache.attachments[imageName];
            }
          }

          // Save cache
          cache.repositorySha = currentRepoSha;
          cache.lastSync = new Date().toISOString();

          await saveCache(cache);

          logger.info(
            `Cache updated: ${Object.keys(cache.files).length} files, ${Object.keys(cache.attachments).length} attachments tracked`
          );

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
