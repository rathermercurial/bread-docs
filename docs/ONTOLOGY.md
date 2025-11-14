# Data Collections Ontology

This document describes the semantic model for Breadchain data collections, based on established standards.

## Overview

The collection architecture follows established semantic web standards:

1. **Organizations** - DOAP (Description of a Project)
2. **Offers** - schema.org/Offer
3. **Contributors** - FOAF (Friend of a Friend)

## Why This Matters

Using established ontologies ensures:
- **Interoperability**: Data can be understood across systems
- **Semantic Clarity**: Clear distinction between entities, people, and things
- **Extensibility**: Easy to map to RDF, JSON-LD, or other formats
- **Best Practices**: Leverage decades of knowledge representation work

## The Three Collections

### 1. Organizations (DOAP-inspired)

**Ontology**: [Description of a Project (DOAP)](https://en.wikipedia.org/wiki/DOAP)

**What it represents**: Organizations, projects, cooperatives, and similar entities

**Examples**:
- Breadchain Cooperative (member project)
- Angel Minter A (angel minter)
- Community Project B (both member + angel)

**Not for**:
- ❌ Products being sold (use Offers)
- ❌ Individual people (use Contributors)

**Key Properties**:
- `isMemberProject` - Is this a member project?
- `isAngelMinter` - Is this an angel minter?
- `ethereumAddress` - On-chain identity
- `description`, `website`, `github` - Project metadata

**Why DOAP?**
- Designed specifically for describing software/organizational projects
- Supports version control, maintainers, repository info
- Widely used in open source ecosystems
- Maps cleanly to other ontologies (Dublin Core, FOAF)

### 2. Offers (schema.org/Offer)

**Ontology**: [schema.org/Offer](https://schema.org/Offer)

**What it represents**: Marketplace listings - products, services, goods being offered for sale/exchange

**Examples**:
- Artisan bread for sale
- Consulting services
- Workshop tickets
- Physical products in marketplace

**Not for**:
- ❌ The organization selling it (use Organizations with `seller` reference)
- ❌ General project descriptions (use Organizations)

**Key Properties**:
- `price` - Price of the offer
- `priceCurrency` - Currency (USD, ETH, etc.)
- `seller` - Organization ID offering this
- `availability` - InStock, OutOfStock, etc.
- `itemOffered` - What type of thing is being offered

**Why schema.org/Offer?**
- Industry standard for e-commerce/marketplace data
- Used by Google, major search engines
- Rich vocabulary for pricing, availability, seller info
- Can extend to full Product schema if needed

### 3. Contributors (FOAF-inspired)

**Ontology**: [Friend of a Friend (FOAF)](https://en.wikipedia.org/wiki/FOAF)

**What it represents**: People - contributors, authors, community members

**Examples**:
- Alice (developer)
- Bob (community organizer)
- Charlie (artist)

**Not for**:
- ❌ Organizations or projects (use Organizations)
- ❌ Products or services (use Offers)

**Key Properties**:
- `name`, `bio`, `avatar` - Basic identity
- `githubUsername`, `ethereumAddress`, `ensName` - Online identities
- `hatsRoles` - Roles in Hats Protocol
- `organizations` - Which organizations they contribute to

**Why FOAF?**
- Standard for describing people and their relationships
- Designed for social networks and identity
- Supports multiple identities (web, blockchain, social)
- Can link people to projects, organizations

## Relationships Between Collections

### Organizations → Offers
An organization can have many offers:

```typescript
// Organization
{
  "id": "breadchain",
  "name": "Breadchain Cooperative",
  "isMemberProject": true
}

// Offers from this organization
{
  "id": "sourdough-bread",
  "name": "Artisan Sourdough Bread",
  "seller": "breadchain",  // ← References organization
  "price": 12.00,
  "priceCurrency": "USD"
}
```

Query:
```typescript
// Get all offers from an organization
const breadchainOffers = await getCollection('offers',
  (offer) => offer.data.seller === 'breadchain'
);
```

### Contributors → Organizations
Contributors can be part of multiple organizations:

```typescript
// Contributor
{
  "id": "alice",
  "name": "Alice Johnson",
  "organizations": ["breadchain", "project-b"]  // ← References orgs
}

// Query contributors for an org
const breadchainContributors = await getCollection('contributors',
  (c) => c.data.organizations.includes('breadchain')
);
```

### Organizations → Contributors
Organizations can list contributors via reverse lookup:

```typescript
// Get all contributors for an organization
const orgContributors = await getCollection('contributors',
  (c) => c.data.organizations.includes('breadchain')
);
```

## Mapping to Standards

### JSON-LD Example (Organization)

```json
{
  "@context": "http://usefulinc.com/ns/doap#",
  "@type": "Project",
  "name": "Breadchain Cooperative",
  "description": "A decentralized cooperative...",
  "homepage": "https://breadchain.xyz",
  "repository": {
    "@type": "GitRepository",
    "location": "https://github.com/BreadchainCoop"
  }
}
```

### JSON-LD Example (Offer)

```json
{
  "@context": "https://schema.org/",
  "@type": "Offer",
  "name": "Artisan Sourdough Bread",
  "description": "Fresh baked sourdough",
  "price": "12.00",
  "priceCurrency": "USD",
  "availability": "https://schema.org/InStock",
  "seller": {
    "@type": "Organization",
    "name": "Breadchain Cooperative"
  }
}
```

### JSON-LD Example (Contributor)

```json
{
  "@context": "http://xmlns.com/foaf/0.1/",
  "@type": "Person",
  "name": "Alice Johnson",
  "mbox": "mailto:alice@example.com",
  "homepage": "https://alice.dev",
  "account": [
    {
      "@type": "OnlineAccount",
      "accountServiceHomepage": "https://github.com",
      "accountName": "alice"
    }
  ]
}
```

## Anti-Patterns (What NOT to Do)

### ❌ DON'T: Mix offers with organizations

```json
// WRONG - isMarketplace flag on organization
{
  "id": "breadchain",
  "isMemberProject": true,
  "isMarketplace": true  // ← NO! Org != Offer
}
```

**Correct approach**:
```json
// Organization
{
  "id": "breadchain",
  "isMemberProject": true
}

// Separate offer
{
  "id": "sourdough",
  "seller": "breadchain",
  "price": 12.00
}
```

### ❌ DON'T: Put contributor data in organizations

```json
// WRONG - mixing person and org
{
  "id": "alice-project",
  "name": "Alice's Project",
  "email": "alice@example.com",  // ← Person data in org
  "bio": "I'm a developer"  // ← Person data in org
}
```

**Correct approach**:
```json
// Organization
{
  "id": "alice-project",
  "name": "Alice's Project"
}

// Contributor
{
  "id": "alice",
  "name": "Alice",
  "email": "alice@example.com",
  "organizations": ["alice-project"]
}
```

## Benefits of This Ontology

### 1. Semantic Clarity
Each collection has a clear, distinct purpose based on what it represents in the real world

### 2. Query Precision
```typescript
// Clear: Get products for sale
const offers = await getCollection('offers');

// Clear: Get organizations
const orgs = await getCollection('organizations');

// NOT confusing: isMarketplace on an organization
```

### 3. Extensibility
Easy to add new fields that align with standards:
```typescript
// Adding schema.org fields to offers
validFrom: "2024-01-01",
validThrough: "2024-12-31",
acceptedPaymentMethod: ["CreditCard", "Cryptocurrency"]
```

### 4. Interoperability
Data can be exported to:
- RDF/Turtle
- JSON-LD
- GraphQL schemas
- OpenAPI specs

### 5. Future-Proof
Standards-based design makes it easy to:
- Integrate with semantic web tools
- Connect to other knowledge graphs
- Support emerging standards
- Add new collection types

## Further Reading

- [DOAP Specification](https://github.com/ewilderj/doap/wiki)
- [schema.org/Offer](https://schema.org/Offer)
- [schema.org/Product](https://schema.org/Product)
- [FOAF Specification](http://xmlns.com/foaf/spec/)
- [JSON-LD](https://json-ld.org/)
- [Linked Data Principles](https://www.w3.org/DesignIssues/LinkedData.html)

## Summary

| Collection | Ontology | Represents | Example |
|------------|----------|------------|---------|
| **Organizations** | DOAP | Projects, cooperatives, entities | Breadchain Coop |
| **Offers** | schema.org/Offer | Products, services for sale | Sourdough bread |
| **Contributors** | FOAF | People, authors, contributors | Alice Johnson |

**Key Principle**: Each thing in the real world maps to exactly one collection type based on what it IS, not what it DOES.
