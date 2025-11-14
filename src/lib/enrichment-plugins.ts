/**
 * Enrichment plugin system for Astro data collections
 *
 * This module provides a foundation for adding enrichment plugins to data loaders.
 * Plugins can fetch additional data from external sources like ENS, Hats Protocol,
 * GitHub API, etc.
 *
 * To add a new enrichment source:
 * 1. Create a new plugin implementing the EnrichmentPlugin interface
 * 2. Add it to the loader configuration with enabled: true/false
 * 3. No changes to core loader code required!
 *
 * Example:
 * ```ts
 * const ensPlugin: EnrichmentPlugin<ContributorEntry> = {
 *   name: 'ens-enrichment',
 *   enabled: true,
 *   async enrich(entry, context) {
 *     if (entry.ethereumAddress) {
 *       entry.ensName = await lookupENS(entry.ethereumAddress);
 *     }
 *     return entry;
 *   }
 * };
 * ```
 */

import type { EnrichmentPlugin, EnrichmentContext, BaseDataEntry } from './data-loader-base';

/**
 * Example: ENS Name Resolution Plugin
 *
 * Resolves ENS names for Ethereum addresses
 * Currently disabled - enable when you want to add ENS resolution
 *
 * To enable:
 * 1. Set enabled: true
 * 2. Add ENS resolution library (e.g., ethers.js or viem)
 * 3. Implement the lookupENS() function
 */
export const ensEnrichmentPlugin: EnrichmentPlugin = {
  name: 'ens-enrichment',
  enabled: false, // Set to true when ready to use

  async enrich(entry, context) {
    const { logger } = context;

    // Check if entry has an ethereum address
    if ('ethereumAddress' in entry && entry.ethereumAddress) {
      try {
        // TODO: Implement ENS lookup
        // const ensName = await lookupENS(entry.ethereumAddress as string);
        // if (ensName) {
        //   entry.ensName = ensName;
        //   logger.info(`  ENS resolved: ${entry.id} → ${ensName}`);
        // }

        logger.info(`  ENS lookup skipped (not implemented): ${entry.id}`);
      } catch (error) {
        logger.warn(`  ENS lookup failed for ${entry.id}: ${error}`);
      }
    }

    return entry;
  },

  // Batch enrichment for efficiency (single RPC call for multiple addresses)
  async enrichBatch(entries, context) {
    const { logger } = context;

    // TODO: Implement batch ENS lookup
    // const addresses = entries
    //   .filter(e => 'ethereumAddress' in e && e.ethereumAddress)
    //   .map(e => e.ethereumAddress as string);
    //
    // const ensNames = await batchLookupENS(addresses);
    //
    // for (const entry of entries) {
    //   if ('ethereumAddress' in entry && entry.ethereumAddress) {
    //     const ensName = ensNames.get(entry.ethereumAddress as string);
    //     if (ensName) entry.ensName = ensName;
    //   }
    // }

    logger.info('  Batch ENS lookup skipped (not implemented)');
    return entries;
  },
};

/**
 * Example: Hats Protocol Enrichment Plugin
 *
 * Fetches role/membership data from Hats Protocol
 * Currently disabled - enable when you want to add Hats Protocol integration
 *
 * To enable:
 * 1. Set enabled: true
 * 2. Add Hats Protocol SDK
 * 3. Implement the fetchHatsRoles() function
 */
export const hatsProtocolPlugin: EnrichmentPlugin = {
  name: 'hats-protocol',
  enabled: false, // Set to true when ready to use

  async enrich(entry, context) {
    const { logger } = context;

    if ('ethereumAddress' in entry && entry.ethereumAddress) {
      try {
        // TODO: Implement Hats Protocol lookup
        // const hatsRoles = await fetchHatsRoles(entry.ethereumAddress as string);
        // if (hatsRoles.length > 0) {
        //   entry.hatsRoles = hatsRoles;
        //   logger.info(`  Hats roles found: ${entry.id} → ${hatsRoles.length} roles`);
        // }

        logger.info(`  Hats Protocol lookup skipped (not implemented): ${entry.id}`);
      } catch (error) {
        logger.warn(`  Hats Protocol lookup failed for ${entry.id}: ${error}`);
      }
    }

    return entry;
  },
};

/**
 * Example: GitHub Profile Enrichment Plugin
 *
 * Fetches additional GitHub profile data using the GitHub API
 * Uses the same Octokit instance from the loader context
 */
export const githubProfilePlugin: EnrichmentPlugin = {
  name: 'github-profile',
  enabled: false, // Set to true when ready to use

  async enrich(entry, context) {
    const { octokit, logger } = context;

    if ('githubUsername' in entry && entry.githubUsername) {
      try {
        const { data: user } = await octokit.rest.users.getByUsername({
          username: entry.githubUsername as string,
        });

        // Enrich with GitHub data
        if (!entry.name) entry.name = user.name || user.login;
        if (!entry.bio && user.bio) entry.bio = user.bio;
        if (!entry.avatar && user.avatar_url) entry.avatar = user.avatar_url;
        if (!entry.website && user.blog) entry.website = user.blog;
        if (!entry.twitter && user.twitter_username) {
          entry.twitter = user.twitter_username;
        }

        logger.info(`  GitHub profile enriched: ${entry.id}`);
      } catch (error) {
        logger.warn(`  GitHub profile lookup failed for ${entry.id}: ${error}`);
      }
    }

    return entry;
  },

  // Batch enrichment to respect GitHub API rate limits
  async enrichBatch(entries, context) {
    const { logger } = context;

    // Process entries with some delay to avoid rate limiting
    const enriched = [];
    for (const entry of entries) {
      const result = await this.enrich(entry, context);
      enriched.push(result);

      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return enriched;
  },
};

/**
 * Example: Ethereum Address Validation Plugin
 *
 * Validates and normalizes Ethereum addresses
 * This is a simple plugin that doesn't require external APIs
 */
export const ethereumValidationPlugin: EnrichmentPlugin = {
  name: 'ethereum-validation',
  enabled: false, // Set to true when ready to use

  async enrich(entry, context) {
    const { logger } = context;

    if ('ethereumAddress' in entry && entry.ethereumAddress) {
      const address = entry.ethereumAddress as string;

      // Basic validation (40 hex chars with 0x prefix)
      const isValid = /^0x[a-fA-F0-9]{40}$/.test(address);

      if (!isValid) {
        logger.warn(`  Invalid Ethereum address for ${entry.id}: ${address}`);
        // Optionally remove invalid addresses
        // delete entry.ethereumAddress;
      } else {
        // Normalize to lowercase
        entry.ethereumAddress = address.toLowerCase();
        logger.info(`  Ethereum address validated: ${entry.id}`);
      }
    }

    return entry;
  },
};

/**
 * Example: Metadata Enrichment Plugin
 *
 * Adds automatic metadata like timestamps, slugs, etc.
 * This is a simple plugin that works on all entries
 */
export const metadataPlugin: EnrichmentPlugin = {
  name: 'metadata',
  enabled: true, // Usually want this enabled

  async enrich(entry, context) {
    // Add processing timestamp if not present
    if (!('enrichedAt' in entry)) {
      entry.enrichedAt = new Date().toISOString();
    }

    // Generate slug from name if not present
    if ('name' in entry && !('slug' in entry)) {
      const name = entry.name as string;
      entry.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    return entry;
  },
};

/**
 * Helper function: Create a custom enrichment plugin inline
 *
 * Example:
 * ```ts
 * const myPlugin = createEnrichmentPlugin('my-plugin', async (entry, context) => {
 *   // Your enrichment logic here
 *   return entry;
 * });
 * ```
 */
export function createEnrichmentPlugin<T extends BaseDataEntry>(
  name: string,
  enrichFn: (entry: T, context: EnrichmentContext) => Promise<T>,
  options: { enabled?: boolean; batchFn?: typeof enrichFn } = {}
): EnrichmentPlugin<T> {
  return {
    name,
    enabled: options.enabled ?? true,
    enrich: enrichFn,
    enrichBatch: options.batchFn,
  };
}

/**
 * Preset plugin collections for common use cases
 */
export const enrichmentPresets = {
  /**
   * Minimal preset - just metadata
   */
  minimal: [metadataPlugin],

  /**
   * Blockchain preset - ENS + Hats + validation
   */
  blockchain: [ethereumValidationPlugin, ensEnrichmentPlugin, hatsProtocolPlugin, metadataPlugin],

  /**
   * Social preset - GitHub profiles
   */
  social: [githubProfilePlugin, metadataPlugin],

  /**
   * Full preset - all plugins
   */
  full: [
    ethereumValidationPlugin,
    ensEnrichmentPlugin,
    hatsProtocolPlugin,
    githubProfilePlugin,
    metadataPlugin,
  ],
};
