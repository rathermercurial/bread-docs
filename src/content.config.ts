import { defineCollection, z, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// ============================================================================
// ENTITY SCHEMA (Schema.org Thing)
// ============================================================================

/**
 * Base entity schema (Thing type from schema.org)
 * Common properties for both Person and Organization
 */
const entity = z.object({
	// Core identity
	name: z.string().describe('Entity name'),

	description: z.string().optional().describe('Entity description'),

	url: z.string().url().optional().describe('Primary URL'),

	image: z.string().optional().describe('Profile image or logo'),

	identifier: z.string().optional().describe('Ethereum address or unique ID'),

	sameAs: z.array(z.string().url()).optional().default([]).describe(
		'URLs for other profiles (Twitter, GitHub, etc.)'
	),

	// Contact
	email: z.string().email().optional().describe('Contact email'),

	// Web3 identity
	ensName: z.string().optional().describe('ENS name'),

	// Filtering flags
	isAngelMinter: z.boolean().default(false).describe('Angel Minter status'),
});

// ============================================================================
// PERSON COLLECTION (Schema.org Person)
// ============================================================================

/**
 * Person collection for contributors, angel minters, and individuals
 */
const person = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/data/person' }),
	schema: entity.extend({
		// Professional context
		jobTitle: z.string().optional().describe('Job title or role'),

		// Organizational relationships
		memberOf: z.array(
			z.union([
				reference('organization'),
				z.string()
			])
		).optional().default([]).describe('Organizations this person is a member of'),

		worksFor: z.array(
			z.union([
				reference('organization'),
				z.string()
			])
		).optional().default([]).describe('Organizations this person works for'),

		// Filtering flags
		isContributor: z.boolean().default(false).describe('Breadchain contributor status'),

		// Marketplace
		makesOffer: z.array(reference('offer')).optional().default([]).describe(
			'Offers made by this person'
		),
	}),
});

// ============================================================================
// ORGANIZATION COLLECTION (Schema.org Organization)
// ============================================================================

/**
 * Organization collection for member projects, cooperatives, and groups
 */
const organization = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/data/organization' }),
	schema: entity.extend({
		// Organizational relationships
		member: z.array(
			z.union([
				reference('person'),
				z.string()
			])
		).optional().default([]).describe('Members of this organization'),

		parentOrganization: z.union([
			reference('organization'),
			z.string()
		]).optional().describe('Parent organization'),

		// Filtering flags
		isMemberProject: z.boolean().default(false).describe('Member project status'),

		// Marketplace
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
 */
const offer = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/data/offer' }),
	schema: z.object({
		// Basic info
		name: z.string().describe('Offer name'),

		description: z.string().optional().describe('Offer description'),

		// Provider (interlinks with person/organization via makesOffer)
		offeredBy: z.union([
			reference('person'),
			reference('organization'),
			z.string()
		]).describe('The person or organization making this offer'),

		// What is offered
		itemOffered: z.string().describe('Product, service, or item being offered'),

		// Links
		url: z.string().url().optional().describe('URL for more information'),

		image: z.string().optional().describe('Offer image'),
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
