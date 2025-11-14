import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { createOrganizationsLoader } from './loaders/organizations-loader';
import { createContributorsLoader } from './loaders/contributors-loader';
import { createOffersLoader } from './loaders/offers-loader';
import { loadEnv } from 'vite';

// Load environment variables
const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

/**
 * Organizations Collection Schema (DOAP-inspired)
 * For organizations/projects: member projects, angel minters, etc.
 * See: https://en.wikipedia.org/wiki/DOAP
 */
const organizationsSchema = z.object({
	// Identity
	id: z.string(),
	name: z.string(),
	slug: z.string().optional(),

	// Description
	description: z.string(),
	longDescription: z.string().optional(),
	content: z.string().optional(), // Markdown content if using .md files

	// Organization type flags
	isMemberProject: z.boolean().default(false),
	isAngelMinter: z.boolean().default(false),

	// Assets
	logo: z.string().optional(),
	banner: z.string().optional(),

	// Web presence
	website: z.string().url().optional(),
	documentation: z.string().url().optional(),
	github: z.string().optional(),

	// Blockchain
	ethereumAddress: z.string().optional(),
	ensName: z.string().optional(),
	chainId: z.number().optional(),

	// Social
	twitter: z.string().optional(),
	discord: z.string().optional(),
	telegram: z.string().optional(),

	// Metadata
	tags: z.array(z.string()).default([]),
	category: z.string().optional(),
	status: z.enum(['active', 'archived', 'planned']).default('active'),

	// Dates
	createdAt: z.string().datetime().optional(),
	updatedAt: z.string().datetime().optional(),
	enrichedAt: z.string().datetime().optional(),
});

/**
 * Offers Collection Schema (schema.org/Offer inspired)
 * For marketplace listings: products, services, and goods being offered
 * See: https://schema.org/Offer
 */
const offersSchema = z.object({
	// Identity
	id: z.string(),
	name: z.string(),
	slug: z.string().optional(),

	// Description
	description: z.string(),
	longDescription: z.string().optional(),
	content: z.string().optional(), // Markdown content if using .md files

	// Offer details (schema.org/Offer)
	price: z.number().optional(),
	priceCurrency: z.string().optional(), // ISO 4217 (USD, ETH, etc.)
	availability: z
		.enum(['InStock', 'OutOfStock', 'PreOrder', 'Discontinued', 'LimitedAvailability'])
		.optional(),

	// Seller/Provider (reference to organization)
	seller: z.string().optional(), // Organization ID
	sellerName: z.string().optional(),

	// Assets
	image: z.string().optional(),
	images: z.array(z.string()).default([]),

	// Web presence
	url: z.string().url().optional(),
	itemOffered: z.string().optional(), // Type of thing being offered

	// Categorization
	category: z.string().optional(),
	tags: z.array(z.string()).default([]),

	// Metadata
	status: z.enum(['active', 'sold', 'archived']).default('active'),
	validFrom: z.string().datetime().optional(),
	validThrough: z.string().datetime().optional(),

	// Dates
	createdAt: z.string().datetime().optional(),
	updatedAt: z.string().datetime().optional(),
	enrichedAt: z.string().datetime().optional(),
});

/**
 * Contributors Collection Schema (FOAF-inspired)
 * For author credits, contributor profiles, and identity management
 * See: https://en.wikipedia.org/wiki/FOAF
 */
const contributorsSchema = z.object({
	// Identity
	id: z.string(),
	name: z.string(),
	username: z.string().optional(),

	// Bio and content
	bio: z.string().optional(),
	content: z.string().optional(), // Markdown content if using .md files
	avatar: z.string().url().optional(),

	// Base identity
	githubUsername: z.string().optional(),
	email: z.string().email().optional(),

	// Blockchain identity
	ethereumAddress: z.string().optional(),
	ensName: z.string().optional(),

	// Hats Protocol roles
	hatsRoles: z
		.array(
			z.object({
				hatId: z.string(),
				hatName: z.string(),
				organization: z.string(),
				treeId: z.string().optional(),
			})
		)
		.default([]),

	// Social
	twitter: z.string().optional(),
	website: z.string().url().optional(),
	linkedin: z.string().optional(),

	// Contributions
	roles: z.array(z.string()).default([]),
	organizations: z.array(z.string()).default([]),

	// Metadata
	isActive: z.boolean().default(true),
	joinedAt: z.string().datetime().optional(),
	enrichedAt: z.string().datetime().optional(),
});

export const collections = {
	// Existing docs collection (Starlight)
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),

	// Organizations collection (DOAP-inspired: projects, cooperatives)
	organizations: defineCollection({
		loader: createOrganizationsLoader({
			owner: env.GITHUB_REPO_OWNER || 'BreadchainCoop',
			repo: env.GITHUB_REPO_NAME || 'shared-obsidian',
			token: env.GITHUB_TOKEN || '',
			path: env.ORGANIZATIONS_PATH || 'data/organizations',
			enableEnrichment: 'minimal', // Change to 'blockchain' or 'full' to enable enrichment
		}),
		schema: organizationsSchema,
	}),

	// Offers collection (schema.org/Offer: marketplace listings)
	offers: defineCollection({
		loader: createOffersLoader({
			owner: env.GITHUB_REPO_OWNER || 'BreadchainCoop',
			repo: env.GITHUB_REPO_NAME || 'shared-obsidian',
			token: env.GITHUB_TOKEN || '',
			path: env.OFFERS_PATH || 'data/offers',
			enableEnrichment: 'minimal',
		}),
		schema: offersSchema,
	}),

	// Contributors collection (FOAF-inspired: people, authors)
	contributors: defineCollection({
		loader: createContributorsLoader({
			owner: env.GITHUB_REPO_OWNER || 'BreadchainCoop',
			repo: env.GITHUB_REPO_NAME || 'shared-obsidian',
			token: env.GITHUB_TOKEN || '',
			path: env.CONTRIBUTORS_PATH || 'data/contributors',
			enableEnrichment: 'minimal', // Change to 'social', 'blockchain', or 'full' to enable enrichment
		}),
		schema: contributorsSchema,
	}),
};
