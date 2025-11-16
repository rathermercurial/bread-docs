import { defineCollection, z, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// ============================================================================
// BASE SCHEMAS (Schema.org Thing)
// ============================================================================

/**
 * Base schema for all entities (Thing type from schema.org)
 * Contains properties common to both Person and Organization
 *
 * This provides a foundation for semantic web alignment and future extensibility
 * without requiring comprehensive implementation of all schema.org properties.
 */
const entityBaseSchema = z.object({
	// Core identity (Thing)
	name: z.string({
		description: 'The name of the entity'
	}),

	description: z.string({
		description: 'A description of the entity'
	}).optional(),

	url: z.string().url().optional().describe(
		'Primary URL for the entity (website, profile, etc.)'
	),

	image: z.string({
		description: 'Profile image or logo path/URL'
	}).optional(),

	identifier: z.string({
		description: 'Primary identifier (Ethereum address for people/orgs, or other unique ID)'
	}).optional(),

	sameAs: z.array(z.string().url()).optional().default([]).describe(
		'Array of URLs for other profiles (ENS, Twitter, GitHub, etc.)'
	),

	// Common flags for filtering/categorization
	isAngelMinter: z.boolean().default(false).describe(
		'Whether this entity is an Angel Minter'
	),
});

// ============================================================================
// PERSON COLLECTION (Schema.org Person + FOAF)
// ============================================================================

/**
 * Person collection for contributors, angel minters, and other individuals
 *
 * Aligned with:
 * - schema.org/Person
 * - FOAF (Friend of a Friend) vocabulary
 */
const person = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/data/person' }),
	schema: entityBaseSchema.extend({
		// Person-specific identity
		givenName: z.string({
			description: 'First/given name'
		}).optional(),

		familyName: z.string({
			description: 'Last/family name'
		}).optional(),

		// Professional context
		jobTitle: z.string({
			description: 'Current job title or role'
		}).optional(),

		// Organizational relationships
		// Uses union to support both collection references AND external string names
		memberOf: z.array(
			z.union([
				reference('organization'),
				z.string() // External organization name
			])
		).optional().default([]).describe(
			'Organizations this person is a member of'
		),

		worksFor: z.array(
			z.union([
				reference('organization'),
				z.string()
			])
		).optional().default([]).describe(
			'Organizations this person works for'
		),

		// Contact (optional, for public profiles)
		email: z.string().email().optional().describe(
			'Public email address'
		),

		// Web3 identity
		ensName: z.string().optional().describe(
			'ENS name (can be auto-resolved from identifier)'
		),

		// Custom flags
		isContributor: z.boolean().default(false).describe(
			'Whether this person is a Breadchain contributor'
		),

		// Offers/marketplace
		makesOffer: z.array(reference('offer')).optional().default([]).describe(
			'Offers made by this person'
		),
	}),
});

// ============================================================================
// ORGANIZATION COLLECTION (Schema.org Organization + DOAP)
// ============================================================================

/**
 * Organization collection for member projects, cooperatives, and groups
 *
 * Aligned with:
 * - schema.org/Organization
 * - DOAP (Description of a Project) vocabulary
 */
const organization = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/data/organization' }),
	schema: entityBaseSchema.extend({
		// Organization-specific identity
		legalName: z.string({
			description: 'Legal/registered name of organization'
		}).optional(),

		alternateName: z.string({
			description: 'Alternate or short name'
		}).optional(),

		// Organizational relationships
		member: z.array(
			z.union([
				reference('person'),
				z.string() // External person name
			])
		).optional().default([]).describe(
			'Members of this organization'
		),

		parentOrganization: z.union([
			reference('organization'),
			z.string()
		]).optional().describe(
			'Parent organization (if this is a suborganization)'
		),

		// Contact
		email: z.string().email().optional().describe(
			'Organization contact email'
		),

		// Custom flags
		isMemberProject: z.boolean().default(false).describe(
			'Whether this is a Breadchain member project'
		),

		// Offers/marketplace
		makesOffer: z.array(reference('offer')).optional().default([]).describe(
			'Offers made by this organization'
		),
	}),
});

// ============================================================================
// OFFER COLLECTION (Schema.org Offer)
// ============================================================================

/**
 * Offer collection for marketplace listings
 *
 * Aligned with:
 * - schema.org/Offer
 */
const offer = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/data/offer' }),
	schema: z.object({
		// Basic offer info
		name: z.string({
			description: 'Name of the offer'
		}),

		description: z.string({
			description: 'Detailed description of what is offered'
		}).optional(),

		// Who is offering
		// Supports both collection references and external entity names
		offeredBy: z.union([
			reference('person'),
			reference('organization'),
			z.string() // External entity name
		]).describe(
			'The person or organization making this offer'
		),

		// What is being offered
		itemOffered: z.string({
			description: 'Description of the product, service, or item being offered'
		}),

		// Pricing
		price: z.string({
			description: 'Price (can be number, range, or "Contact for pricing")'
		}).optional(),

		priceCurrency: z.string().default('USD').describe(
			'ISO 4217 currency code (e.g., USD, EUR, ETH)'
		),

		// Availability
		availability: z.enum([
			'InStock',
			'OutOfStock',
			'PreOrder',
			'Discontinued',
			'OnlineOnly',
			'InStoreOnly',
			'LimitedAvailability'
		]).optional().describe(
			'Current availability status'
		),

		// Temporal validity
		validFrom: z.coerce.date().optional().describe(
			'Date when offer becomes valid'
		),

		validThrough: z.coerce.date().optional().describe(
			'Date when offer expires'
		),

		// Links
		url: z.string().url().optional().describe(
			'URL for more information or to purchase'
		),

		image: z.string({
			description: 'Image representing the offer'
		}).optional(),

		// Categories/tags
		category: z.array(z.string()).optional().default([]).describe(
			'Categories this offer belongs to (e.g., "web-services", "food", "tokens")'
		),
	}),
});

// ============================================================================
// EXPORT ALL COLLECTIONS
// ============================================================================

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	person,
	organization,
	offer,
};
