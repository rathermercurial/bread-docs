import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { createOrganizationsLoader } from './loaders/organizations-loader';
import { createContributorsLoader } from './loaders/contributors-loader';
import { loadEnv } from 'vite';

// Load environment variables
const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

/**
 * Organizations Collection Schema
 * Unified schema for member projects, angel minters, and marketplace listings
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

	// Categorization - use boolean flags for flexible organization types
	isMemberProject: z.boolean().default(false),
	isAngelMinter: z.boolean().default(false),
	isMarketplace: z.boolean().default(false),

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
 * Contributors Collection Schema
 * For author credits, contributor profiles, and identity management
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

	// Organizations collection (member projects, angel minters, marketplace)
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

	// Contributors collection (author profiles, credits)
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
