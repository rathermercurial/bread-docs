import fs from 'fs/promises';
import path from 'path';

const CACHE_VERSION = 1;

export interface CacheData {
  version: number;
  repositorySha: string;
  lastSync: string;
  files: Record<
    string,
    {
      sha: string;
      syncedAt: string;
      localPath: string;
    }
  >;
  attachments: Record<
    string,
    {
      sha: string;
      sourceUrl: string;
      syncedAt: string;
      localPath: string;
      referencedBy: string[];
    }
  >;
}

export function getCachePath(): string {
  return path.join(process.cwd(), '.astro', 'github-wiki-cache.json');
}

export async function loadCache(): Promise<CacheData> {
  const cachePath = getCachePath();

  try {
    const data = await fs.readFile(cachePath, 'utf-8');
    const cache = JSON.parse(data);

    // Version check
    if (cache.version !== CACHE_VERSION) {
      console.warn('Cache version mismatch, rebuilding cache');
      return getEmptyCache();
    }

    return cache;
  } catch (error) {
    // Cache doesn't exist or is corrupted
    return getEmptyCache();
  }
}

export async function saveCache(cache: CacheData): Promise<void> {
  const cachePath = getCachePath();

  // Ensure .astro directory exists
  await fs.mkdir(path.dirname(cachePath), { recursive: true });

  // Write atomically (write to temp, then rename)
  const tempPath = `${cachePath}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(cache, null, 2), 'utf-8');
  await fs.rename(tempPath, cachePath);
}

export function getEmptyCache(): CacheData {
  return {
    version: CACHE_VERSION,
    repositorySha: '',
    lastSync: '',
    files: {},
    attachments: {},
  };
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
