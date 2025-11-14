/**
 * Offers Collection Loader
 *
 * Loads marketplace offer data from GitHub repository
 * Based on schema.org/Offer semantic model
 * See: https://schema.org/Offer
 */

import { createGitHubDataLoader, parseMarkdownFile, parseJsonFile } from '../lib/data-loader-base';
import { enrichmentPresets } from '../lib/enrichment-plugins';
import type { BaseDataEntry } from '../lib/data-loader-base';

/**
 * Offer data structure (schema.org/Offer)
 * Matches the schema defined in content.config.ts
 */
export interface OfferEntry extends BaseDataEntry {
  id: string;
  name: string;
  slug?: string;

  // Description
  description: string;
  longDescription?: string;
  content?: string; // Markdown content if using .md files

  // Offer details (schema.org/Offer)
  price?: number;
  priceCurrency?: string; // ISO 4217 (USD, ETH, etc.)
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'Discontinued' | 'LimitedAvailability';

  // Seller/Provider (reference to organization)
  seller?: string; // Organization ID
  sellerName?: string;

  // Assets
  image?: string;
  images: string[];

  // Web presence
  url?: string;
  itemOffered?: string; // Type of thing being offered

  // Categorization
  category?: string;
  tags: string[];

  // Metadata
  status: 'active' | 'sold' | 'archived';
  validFrom?: string;
  validThrough?: string;

  // Dates
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Custom parser for offer files
 * Supports both JSON and Markdown with frontmatter
 */
function parseOfferFile(content: string, filePath: string): OfferEntry | null {
  const isMarkdown = filePath.endsWith('.md');
  const isJson = filePath.endsWith('.json');

  let parsed: Partial<OfferEntry> | null = null;

  if (isMarkdown) {
    parsed = parseMarkdownFile<OfferEntry>(content, filePath);
  } else if (isJson) {
    parsed = parseJsonFile<OfferEntry>(content, filePath);
  } else {
    console.warn(`Unsupported file type: ${filePath}`);
    return null;
  }

  if (!parsed) return null;

  // Ensure required fields have defaults
  const offer: OfferEntry = {
    id: parsed.id || '',
    name: parsed.name || '',
    slug: parsed.slug,

    description: parsed.description || '',
    longDescription: parsed.longDescription,
    content: parsed.content,

    // Offer details
    price: parsed.price,
    priceCurrency: parsed.priceCurrency,
    availability: parsed.availability,

    // Seller
    seller: parsed.seller,
    sellerName: parsed.sellerName,

    // Assets
    image: parsed.image,
    images: parsed.images || [],

    // Web presence
    url: parsed.url,
    itemOffered: parsed.itemOffered,

    // Categorization
    category: parsed.category,
    tags: parsed.tags || [],

    // Metadata
    status: parsed.status || 'active',
    validFrom: parsed.validFrom,
    validThrough: parsed.validThrough,

    // Dates
    createdAt: parsed.createdAt,
    updatedAt: parsed.updatedAt || new Date().toISOString(),
  };

  return offer;
}

/**
 * Create the offers loader
 *
 * Configuration:
 * - Fetches from 'data/offers' or 'offers' directory in the source repo
 * - Supports both .json and .md files
 * - Uses minimal enrichment preset by default
 *
 * @param options Configuration options
 */
export function createOffersLoader(options: {
  owner: string;
  repo: string;
  token: string;
  path?: string;
  branch?: string;
  enableEnrichment?: 'minimal' | 'blockchain' | 'social' | 'full';
}) {
  const enrichmentPreset = options.enableEnrichment || 'minimal';

  return createGitHubDataLoader<OfferEntry>({
    owner: options.owner,
    repo: options.repo,
    token: options.token,
    path: options.path || 'data/offers',
    branch: options.branch,
    pattern: '*.{json,md}', // Support both JSON and Markdown files
    parser: parseOfferFile,
    enrichmentPlugins: enrichmentPresets[enrichmentPreset],
  });
}
