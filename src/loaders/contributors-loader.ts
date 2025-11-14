/**
 * Contributors Collection Loader
 *
 * Loads contributor profile data from GitHub repository
 * Supports enrichment from multiple sources:
 * - Ethereum addresses & ENS names
 * - Hats Protocol roles
 * - GitHub profiles
 * - Markdown content from source files
 */

import { createGitHubDataLoader, parseMarkdownFile, parseJsonFile } from '../lib/data-loader-base';
import { enrichmentPresets } from '../lib/enrichment-plugins';
import type { BaseDataEntry } from '../lib/data-loader-base';

/**
 * Contributor data structure
 * Matches the schema defined in content.config.ts
 */
export interface ContributorEntry extends BaseDataEntry {
  id: string;
  name: string;
  username?: string;

  // Bio and content
  bio?: string;
  content?: string; // Markdown content if using .md files
  avatar?: string;

  // Base identity
  githubUsername?: string;
  email?: string;

  // Blockchain identity
  ethereumAddress?: string;
  ensName?: string;

  // Hats Protocol roles
  hatsRoles: Array<{
    hatId: string;
    hatName: string;
    organization: string;
    treeId?: string;
  }>;

  // Social
  twitter?: string;
  website?: string;
  linkedin?: string;

  // Contributions
  roles: string[];
  organizations: string[];

  // Metadata
  isActive: boolean;
  joinedAt?: string;
  enrichedAt?: string;
}

/**
 * Custom parser for contributor files
 * Supports both JSON and Markdown with frontmatter
 */
function parseContributorFile(content: string, filePath: string): ContributorEntry | null {
  const isMarkdown = filePath.endsWith('.md');
  const isJson = filePath.endsWith('.json');

  let parsed: Partial<ContributorEntry> | null = null;

  if (isMarkdown) {
    parsed = parseMarkdownFile<ContributorEntry>(content, filePath);
  } else if (isJson) {
    parsed = parseJsonFile<ContributorEntry>(content, filePath);
  } else {
    console.warn(`Unsupported file type: ${filePath}`);
    return null;
  }

  if (!parsed) return null;

  // Ensure required fields have defaults
  const contributor: ContributorEntry = {
    id: parsed.id || '',
    name: parsed.name || '',
    username: parsed.username,

    // Bio and content
    bio: parsed.bio,
    content: parsed.content,
    avatar: parsed.avatar,

    // Base identity
    githubUsername: parsed.githubUsername,
    email: parsed.email,

    // Blockchain identity
    ethereumAddress: parsed.ethereumAddress,
    ensName: parsed.ensName,

    // Hats Protocol roles
    hatsRoles: parsed.hatsRoles || [],

    // Social
    twitter: parsed.twitter,
    website: parsed.website,
    linkedin: parsed.linkedin,

    // Contributions
    roles: parsed.roles || [],
    organizations: parsed.organizations || [],

    // Metadata
    isActive: parsed.isActive ?? true,
    joinedAt: parsed.joinedAt,
    enrichedAt: parsed.enrichedAt,
  };

  return contributor;
}

/**
 * Create the contributors loader
 *
 * Configuration:
 * - Fetches from 'data/contributors' or 'contributors' directory in the source repo
 * - Supports both .json and .md files
 * - Uses full enrichment preset by default (all enrichment sources)
 * - To disable enrichment, change preset to 'minimal'
 *
 * @param options Configuration options
 */
export function createContributorsLoader(options: {
  owner: string;
  repo: string;
  token: string;
  path?: string;
  branch?: string;
  enableEnrichment?: 'minimal' | 'blockchain' | 'social' | 'full';
}) {
  const enrichmentPreset = options.enableEnrichment || 'minimal';

  return createGitHubDataLoader<ContributorEntry>({
    owner: options.owner,
    repo: options.repo,
    token: options.token,
    path: options.path || 'data/contributors',
    branch: options.branch,
    pattern: '*.{json,md}', // Support both JSON and Markdown files
    parser: parseContributorFile,
    enrichmentPlugins: enrichmentPresets[enrichmentPreset],
  });
}
