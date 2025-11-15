/**
 * Entity Collections Utility Library
 *
 * Provides helper functions for working with Person, Organization, and Offer collections.
 * Enables polymorphic queries across entity types and simplifies common operations.
 */

import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Unified entity type that can be either a person or organization
 * with a discriminator field for type checking
 */
export type Entity =
	| (CollectionEntry<'person'> & { entityType: 'person' })
	| (CollectionEntry<'organization'> & { entityType: 'organization' });

// ============================================================================
// COLLECTION AGGREGATION
// ============================================================================

/**
 * Get all entities (people + organizations) with unified type
 * Useful for displaying mixed entity directories
 *
 * @returns Array of entities with discriminator field
 * @example
 * const entities = await getAllEntities();
 * entities.forEach(e => {
 *   console.log(e.data.name, e.entityType);
 * });
 */
export async function getAllEntities(): Promise<Entity[]> {
	const people = await getCollection('person');
	const orgs = await getCollection('organization');

	return [
		...people.map((p) => ({ ...p, entityType: 'person' as const })),
		...orgs.map((o) => ({ ...o, entityType: 'organization' as const })),
	];
}

// ============================================================================
// FILTERED QUERIES
// ============================================================================

/**
 * Get all angel minters (people AND organizations)
 *
 * @returns Array of entities where isAngelMinter = true
 * @example
 * const minters = await getAngelMinters();
 * // Use in angel-minters.astro page
 */
export async function getAngelMinters(): Promise<Entity[]> {
	const people = await getCollection('person', ({ data }) => data.isAngelMinter);
	const orgs = await getCollection('organization', ({ data }) => data.isAngelMinter);

	return [
		...people.map((p) => ({ ...p, entityType: 'person' as const })),
		...orgs.map((o) => ({ ...o, entityType: 'organization' as const })),
	];
}

/**
 * Get all contributors (people only)
 *
 * @returns Array of person entities where isContributor = true
 * @example
 * const contributors = await getContributors();
 * // Use in contributors.astro page
 */
export async function getContributors(): Promise<CollectionEntry<'person'>[]> {
	return getCollection('person', ({ data }) => data.isContributor);
}

/**
 * Get all member projects (organizations only)
 *
 * @returns Array of organization entities where isMemberProject = true
 * @example
 * const projects = await getMemberProjects();
 * // Use in member-projects.astro page
 */
export async function getMemberProjects(): Promise<CollectionEntry<'organization'>[]> {
	return getCollection('organization', ({ data }) => data.isMemberProject);
}

/**
 * Generic filter for entities by any boolean flag
 *
 * @param flag - The boolean property to filter by
 * @param value - The value to match (default: true)
 * @returns Filtered entities
 */
export async function getEntitiesByFlag(
	flag: keyof Pick<Entity['data'], 'isAngelMinter'>,
	value: boolean = true
): Promise<Entity[]> {
	const all = await getAllEntities();
	return all.filter((e) => e.data[flag] === value);
}

// ============================================================================
// REFERENCE RESOLUTION
// ============================================================================

/**
 * Resolve an entity reference to a full entity object
 * Handles collection references (which may be ReferenceDataEntry) and external strings
 *
 * @param ref - Collection reference or external string
 * @param collection - The collection type ('person' or 'organization')
 * @returns Resolved entity or original string
 * @example
 * const provider = await resolveEntityReference(offer.data.offeredBy, 'person');
 * if (typeof provider !== 'string') {
 *   console.log(provider.data.name);
 * }
 */
export async function resolveEntityReference(
	ref: unknown,
	expectedCollection?: 'person' | 'organization'
): Promise<Entity | string | null> {
	if (typeof ref === 'string') {
		return ref; // External entity, return as-is
	}

	// Check if it's a reference object
	if (ref && typeof ref === 'object' && 'collection' in ref && 'id' in ref) {
		const refObj = ref as { collection: string; id: string };

		// Fetch the actual entry
		if (refObj.collection === 'person') {
			const entry = await getEntry('person', refObj.id);
			if (!entry) return null;
			return {
				...entry,
				entityType: 'person' as const,
			};
		} else if (refObj.collection === 'organization') {
			const entry = await getEntry('organization', refObj.id);
			if (!entry) return null;
			return {
				...entry,
				entityType: 'organization' as const,
			};
		}
	}

	return null;
}

/**
 * Resolve multiple entity references
 *
 * @param refs - Array of references to resolve
 * @returns Array of resolved entities or strings (nulls filtered out)
 */
export async function resolveEntityReferences(
	refs: unknown[]
): Promise<(Entity | string)[]> {
	const resolved = await Promise.all(refs.map(ref => resolveEntityReference(ref)));
	return resolved.filter((r): r is Entity | string => r !== null);
}

/**
 * Get entity by Ethereum address
 *
 * @param address - Ethereum address to search for
 * @returns Entity with matching identifier, or undefined
 * @example
 * const entity = await getEntityByAddress('0x742d35...');
 */
export async function getEntityByAddress(address: string): Promise<Entity | undefined> {
	const all = await getAllEntities();
	return all.find((e) => e.data.identifier?.toLowerCase() === address.toLowerCase());
}

/**
 * Get entity by slug
 *
 * @param collection - Collection to search ('person' or 'organization')
 * @param slug - Entity slug
 * @returns Entity or undefined
 */
export async function getEntityBySlug(
	collection: 'person' | 'organization',
	slug: string
): Promise<Entity | undefined> {
	if (collection === 'person') {
		const entry = await getEntry('person', slug);
		if (!entry) return undefined;
		return {
			...entry,
			entityType: 'person' as const,
		};
	} else {
		const entry = await getEntry('organization', slug);
		if (!entry) return undefined;
		return {
			...entry,
			entityType: 'organization' as const,
		};
	}
}

// ============================================================================
// OFFER UTILITIES
// ============================================================================

/**
 * Get all offers made by a specific entity
 *
 * @param entity - Person or organization entity
 * @returns Array of offers by this entity
 * @example
 * const offers = await getOffersByEntity(person);
 */
export async function getOffersByEntity(
	entity: CollectionEntry<'person'> | CollectionEntry<'organization'>
): Promise<CollectionEntry<'offer'>[]> {
	const allOffers = await getCollection('offer');

	return allOffers.filter((offer) => {
		const offeredBy = offer.data.offeredBy;
		if (typeof offeredBy === 'string') return false;
		return offeredBy.id === entity.id;
	});
}

/**
 * Resolve offer provider (offeredBy) to entity
 *
 * @param offer - Offer collection entry
 * @returns Provider entity or external name string
 */
export async function resolveOfferProvider(
	offer: CollectionEntry<'offer'>
): Promise<Entity | string | null> {
	const offeredBy = offer.data.offeredBy;
	if (typeof offeredBy === 'string') {
		return offeredBy;
	}
	return resolveEntityReference(offeredBy);
}

/**
 * Get all offers, optionally filtered by category
 *
 * @param category - Optional category to filter by
 * @returns Array of offers
 * @example
 * const webServices = await getOffers('web-services');
 */
export async function getOffers(category?: string): Promise<CollectionEntry<'offer'>[]> {
	if (!category) {
		return getCollection('offer');
	}

	return getCollection('offer', ({ data }) => data.category?.includes(category) ?? false);
}

// ============================================================================
// SORTING & FILTERING
// ============================================================================

/**
 * Sort entities by name
 *
 * @param entities - Array of entities to sort
 * @returns Sorted array
 */
export function sortEntitiesByName(entities: Entity[]): Entity[] {
	return entities.sort((a, b) => a.data.name.localeCompare(b.data.name));
}

/**
 * Group entities by type
 *
 * @param entities - Array of entities to group
 * @returns Object with people and organizations arrays
 */
export function groupEntitiesByType(entities: Entity[]) {
	return {
		people: entities.filter((e) => e.entityType === 'person'),
		organizations: entities.filter((e) => e.entityType === 'organization'),
	};
}

// ============================================================================
// DISPLAY HELPERS
// ============================================================================

/**
 * Get display name for entity (handles different name structures)
 *
 * @param entity - Entity to get name for
 * @returns Display-friendly name
 * @example
 * const name = getEntityDisplayName(entity); // "Alice Chen" or "Breadchain Cooperative"
 */
export function getEntityDisplayName(entity: Entity): string {
	if (entity.entityType === 'person') {
		const { givenName, familyName } = entity.data;
		if (givenName && familyName) {
			return `${givenName} ${familyName}`;
		}
	}
	return entity.data.name;
}

/**
 * Get entity type label for display
 *
 * @param entity - Entity to get type for
 * @returns "Person" or "Organization"
 */
export function getEntityTypeLabel(entity: Entity): string {
	return entity.entityType === 'person' ? 'Person' : 'Organization';
}

/**
 * Get entity icon/emoji for display
 *
 * @param entity - Entity to get icon for
 * @returns Icon character
 */
export function getEntityIcon(entity: Entity): string {
	return entity.entityType === 'person' ? '👤' : '🏢';
}
