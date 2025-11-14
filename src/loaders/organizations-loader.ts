/**
 * Organizations Collection Loader
 *
 * Loads organization data from GitHub repository
 * Supports member projects, angel minters, and marketplace listings
 * in a single unified collection using boolean flags
 */

import { createGitHubDataLoader, parseMarkdownFile, parseJsonFile } from '../lib/data-loader-base';
import { enrichmentPresets } from '../lib/enrichment-plugins';
import type { BaseDataEntry } from '../lib/data-loader-base';

/**
 * Organization data structure
 * Matches the schema defined in content.config.ts
 */
export interface OrganizationEntry extends BaseDataEntry {
  id: string;
  name: string;
  slug?: string;

  // Description
  description: string;
  longDescription?: string;
  content?: string; // Markdown content if using .md files

  // Categorization - this is the key part!
  isMemberProject: boolean;
  isAngelMinter: boolean;
  isMarketplace: boolean;

  // Assets
  logo?: string;
  banner?: string;

  // Web presence
  website?: string;
  documentation?: string;
  github?: string;

  // Blockchain
  ethereumAddress?: string;
  ensName?: string;
  chainId?: number;

  // Social
  twitter?: string;
  discord?: string;
  telegram?: string;

  // Metadata
  tags: string[];
  category?: string;
  status: 'active' | 'archived' | 'planned';

  // Dates
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Custom parser for organization files
 * Supports both JSON and Markdown with frontmatter
 */
function parseOrganizationFile(content: string, filePath: string): OrganizationEntry | null {
  const isMarkdown = filePath.endsWith('.md');
  const isJson = filePath.endsWith('.json');

  let parsed: Partial<OrganizationEntry> | null = null;

  if (isMarkdown) {
    parsed = parseMarkdownFile<OrganizationEntry>(content, filePath);
  } else if (isJson) {
    parsed = parseJsonFile<OrganizationEntry>(content, filePath);
  } else {
    console.warn(`Unsupported file type: ${filePath}`);
    return null;
  }

  if (!parsed) return null;

  // Ensure required fields have defaults
  const org: OrganizationEntry = {
    id: parsed.id || '',
    name: parsed.name || '',
    description: parsed.description || '',
    longDescription: parsed.longDescription,
    content: parsed.content,

    // Default all flags to false
    isMemberProject: parsed.isMemberProject ?? false,
    isAngelMinter: parsed.isAngelMinter ?? false,
    isMarketplace: parsed.isMarketplace ?? false,

    // Assets
    logo: parsed.logo,
    banner: parsed.banner,

    // Web presence
    website: parsed.website,
    documentation: parsed.documentation,
    github: parsed.github,

    // Blockchain
    ethereumAddress: parsed.ethereumAddress,
    ensName: parsed.ensName,
    chainId: parsed.chainId,

    // Social
    twitter: parsed.twitter,
    discord: parsed.discord,
    telegram: parsed.telegram,

    // Metadata
    tags: parsed.tags || [],
    category: parsed.category,
    status: parsed.status || 'active',

    // Dates
    createdAt: parsed.createdAt,
    updatedAt: parsed.updatedAt || new Date().toISOString(),
  };

  return org;
}

/**
 * Create the organizations loader
 *
 * Configuration:
 * - Fetches from 'data/organizations' or 'organizations' directory in the source repo
 * - Supports both .json and .md files
 * - Uses minimal enrichment preset by default (just metadata)
 * - To enable blockchain enrichment, change preset to 'blockchain'
 *
 * @param options Configuration options
 */
export function createOrganizationsLoader(options: {
  owner: string;
  repo: string;
  token: string;
  path?: string;
  branch?: string;
  enableEnrichment?: 'minimal' | 'blockchain' | 'social' | 'full';
}) {
  const enrichmentPreset = options.enableEnrichment || 'minimal';

  return createGitHubDataLoader<OrganizationEntry>({
    owner: options.owner,
    repo: options.repo,
    token: options.token,
    path: options.path || 'data/organizations',
    branch: options.branch,
    pattern: '*.{json,md}', // Support both JSON and Markdown files
    parser: parseOrganizationFile,
    enrichmentPlugins: enrichmentPresets[enrichmentPreset],
  });
}
