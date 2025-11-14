# Data Collection Examples

This document provides example data files for organizations, offers, and contributors collections.

**See also**: [ONTOLOGY.md](./ONTOLOGY.md) for semantic model details

## Organizations Collection (DOAP-inspired)

### Example 1: JSON Format (Member Project + Angel Minter)

**File:** `data/organizations/breadchain.json`

```json
{
  "id": "breadchain",
  "name": "Breadchain Cooperative",
  "slug": "breadchain",
  "description": "A decentralized cooperative building public goods through regenerative finance",
  "longDescription": "Breadchain is a cooperative that leverages blockchain technology to fund public goods and support community-driven projects.",

  "isMemberProject": true,
  "isAngelMinter": true,

  "logo": "/logos/breadchain.svg",
  "banner": "/banners/breadchain.jpg",

  "website": "https://breadchain.xyz",
  "documentation": "https://docs.breadchain.xyz",
  "github": "BreadchainCoop",

  "ethereumAddress": "0x1234567890123456789012345678901234567890",
  "ensName": "breadchain.eth",
  "chainId": 1,

  "twitter": "breadchain_",
  "discord": "https://discord.gg/breadchain",

  "tags": ["cooperative", "defi", "public-goods", "dao"],
  "category": "Cooperative",
  "status": "active",

  "createdAt": "2023-01-15T00:00:00Z",
  "updatedAt": "2024-11-14T00:00:00Z"
}
```

### Example 2: Markdown Format (Member Project)

**File:** `data/organizations/community-project.md`

```markdown
---
id: community-project
name: Community Project
slug: community-project
description: A grassroots community initiative building local infrastructure
longDescription: Extended description of the project, its mission, and impact on the community.
isMemberProject: true
isAngelMinter: false
logo: /logos/community-project.png
website: https://community.example
github: community-project
twitter: communityproj
tags: [community, infrastructure, grassroots]
category: Infrastructure
status: active
createdAt: "2024-03-20T00:00:00Z"
---

# Community Project

## Mission

Our mission is to build resilient local infrastructure through community collaboration
and decentralized governance.

## What We Do

### Infrastructure Building
We focus on creating physical and digital infrastructure that serves community needs.

### Community Organizing
Regular meetups, workshops, and collaborative events.

### Knowledge Sharing
Open documentation and educational resources for everyone.

## Get Involved

Ways to participate:
1. Attend our monthly community calls
2. Contribute to our GitHub repositories
3. Join our Discord server
4. Participate in governance decisions

## Partners

We collaborate with several organizations in the ecosystem:
- Partner 1
- Partner 2
- Partner 3

## Contact

- Discord: https://discord.gg/community-project
- Twitter: @communityproj
- Email: hello@community.example
```

### Example 3: JSON Format (Angel Minter Only)

**File:** `data/organizations/angel-minter-example.json`

```json
{
  "id": "angel-minter-example",
  "name": "Example Angel Minter",
  "description": "An organization that mints tokens for community projects",

  "isMemberProject": false,
  "isAngelMinter": true,

  "website": "https://angelminter.example",
  "ethereumAddress": "0x9876543210987654321098765432109876543210",

  "tags": ["angel-minter", "defi"],
  "status": "active"
}
```

## Offers Collection (schema.org/Offer)

### Example 1: JSON Format (Physical Product)

**File:** `data/offers/sourdough-bread.json`

```json
{
  "id": "sourdough-bread",
  "name": "Artisan Sourdough Bread",
  "slug": "sourdough-bread",
  "description": "Fresh baked sourdough bread made with organic flour",
  "longDescription": "Our signature sourdough is fermented for 24 hours using a 100-year-old starter culture. Made with locally-sourced organic flour and sea salt.",

  "price": 12.00,
  "priceCurrency": "USD",
  "availability": "InStock",

  "seller": "breadchain",
  "sellerName": "Breadchain Cooperative",

  "image": "/images/sourdough-bread.jpg",
  "images": [
    "/images/sourdough-bread-1.jpg",
    "/images/sourdough-bread-2.jpg",
    "/images/sourdough-bread-3.jpg"
  ],

  "url": "https://marketplace.breadchain.xyz/sourdough",
  "itemOffered": "Food Product",

  "category": "Food & Beverage",
  "tags": ["bread", "sourdough", "organic", "artisan"],

  "status": "active",
  "validFrom": "2024-01-01T00:00:00Z",
  "validThrough": "2025-12-31T23:59:59Z",

  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-11-14T00:00:00Z"
}
```

### Example 2: Markdown Format (Service)

**File:** `data/offers/consulting-service.md`

```markdown
---
id: consulting-service
name: Web3 Consulting Service
description: Expert consulting for DAO governance and tokenomics
price: 150
priceCurrency: USD
availability: InStock
seller: community-project
sellerName: Community Project
itemOffered: Service
category: Consulting
tags: [web3, dao, governance, consulting]
status: active
---

# Web3 Consulting Service

## What We Offer

Comprehensive consulting services for DAOs and web3 projects, including:

- Governance framework design
- Tokenomics modeling
- Smart contract architecture review
- Community management strategies

## Pricing

$150/hour with discounts for:
- Community members: 20% off
- Long-term engagements: Custom pricing

## How It Works

1. **Initial Consultation** (free) - 30-minute discovery call
2. **Proposal** - Detailed scope and timeline
3. **Engagement** - Weekly check-ins and deliverables
4. **Follow-up** - Ongoing support available

## Book Now

Contact us at consulting@community.example or through our Discord.
```

### Example 3: JSON Format (Digital Product)

**File:** `data/offers/nft-collection.json`

```json
{
  "id": "genesis-nft-collection",
  "name": "Genesis Collection NFTs",
  "description": "Limited edition NFT collection supporting public goods",

  "price": 0.05,
  "priceCurrency": "ETH",
  "availability": "LimitedAvailability",

  "seller": "breadchain",

  "image": "/images/nft-preview.png",

  "url": "https://mint.breadchain.xyz",
  "itemOffered": "Digital Product",

  "category": "NFT",
  "tags": ["nft", "digital-art", "public-goods"],

  "status": "active",

  "createdAt": "2024-06-01T00:00:00Z"
}
```

### Example 4: Out of Stock Product

**File:** `data/offers/workshop-ticket.json`

```json
{
  "id": "dao-workshop-ticket",
  "name": "DAO Governance Workshop Ticket",
  "description": "Full-day workshop on DAO governance best practices",

  "price": 50,
  "priceCurrency": "USD",
  "availability": "OutOfStock",

  "seller": "community-project",
  "sellerName": "Community Project",

  "itemOffered": "Event Ticket",

  "category": "Event",
  "tags": ["workshop", "dao", "governance", "education"],

  "status": "sold",
  "validFrom": "2024-09-01T00:00:00Z",
  "validThrough": "2024-09-15T00:00:00Z",

  "createdAt": "2024-08-01T00:00:00Z",
  "updatedAt": "2024-09-10T00:00:00Z"
}
```

## Contributors Collection (FOAF-inspired)

### Example 1: JSON Format (Basic Profile)

**File:** `data/contributors/alice.json`

```json
{
  "id": "alice",
  "name": "Alice Johnson",
  "username": "alice",
  "bio": "Full-stack developer and community organizer",
  "avatar": "https://github.com/alice.png",

  "githubUsername": "alice",
  "email": "alice@example.com",

  "ethereumAddress": "0xabc1234567890123456789012345678901234567",
  "ensName": "alice.eth",

  "twitter": "alice_dev",
  "website": "https://alice.dev",
  "linkedin": "alice-johnson",

  "roles": ["Developer", "Community Manager", "Contributor"],
  "organizations": ["breadchain", "community-project"],

  "isActive": true,
  "joinedAt": "2023-06-15T00:00:00Z"
}
```

### Example 2: Markdown Format (Extended Profile)

**File:** `data/contributors/bob.md`

```markdown
---
id: bob
name: Bob Smith
username: bobsmith
bio: Smart contract developer specializing in DAO governance
githubUsername: bobsmith
ethereumAddress: "0xdef9876543210987654321098765432109876543"
ensName: bobsmith.eth
hatsRoles:
  - hatId: "0x00000001"
    hatName: "Core Contributor"
    organization: "breadchain"
    treeId: "1"
  - hatId: "0x00000002"
    hatName: "Developer"
    organization: "breadchain"
    treeId: "1"
twitter: bob_contracts
website: https://bobsmith.dev
roles: [Smart Contract Developer, Auditor]
organizations: [breadchain]
isActive: true
joinedAt: "2023-02-10T00:00:00Z"
---

# Bob Smith

## About Me

I'm a smart contract developer with 5 years of experience in Ethereum development.
I specialize in DAO governance systems and secure contract architecture.

## Skills

- Solidity & Vyper
- Smart Contract Auditing
- DAO Governance Design
- Web3 Frontend Integration

## Projects

### Breadchain Governance System
Led the development of the governance contracts for Breadchain DAO.

### Security Audits
Conducted security reviews for multiple projects in the ecosystem.

## Contributions

### Code
- 200+ commits to core repositories
- 15 smart contracts deployed
- 10+ security audits completed

### Community
- Weekly office hours for developers
- Technical documentation
- Mentoring new contributors

## Contact

Feel free to reach out for collaborations or consulting work:
- Twitter: @bob_contracts
- Website: bobsmith.dev
- Email: Available on request
```

### Example 3: JSON Format (With Hats Protocol Roles)

**File:** `data/contributors/charlie.json`

```json
{
  "id": "charlie",
  "name": "Charlie Davis",
  "username": "charlie",
  "bio": "Community organizer and governance facilitator",

  "githubUsername": "charlie-d",
  "email": "charlie@example.com",

  "ethereumAddress": "0x1111222233334444555566667777888899990000",
  "ensName": "charlie.eth",

  "hatsRoles": [
    {
      "hatId": "0x00000003",
      "hatName": "Community Lead",
      "organization": "breadchain",
      "treeId": "1"
    },
    {
      "hatId": "0x00000004",
      "hatName": "Governance Facilitator",
      "organization": "community-project",
      "treeId": "2"
    }
  ],

  "twitter": "charlie_gov",
  "website": "https://charlie.example",

  "roles": ["Community Lead", "Facilitator", "Organizer"],
  "organizations": ["breadchain", "community-project"],

  "isActive": true,
  "joinedAt": "2023-04-01T00:00:00Z"
}
```

### Example 4: Minimal Profile

**File:** `data/contributors/dana.json`

```json
{
  "id": "dana",
  "name": "Dana Lee",
  "bio": "Designer and creative strategist",
  "githubUsername": "dana-design",
  "roles": ["Designer"],
  "organizations": ["breadchain"],
  "isActive": true
}
```

## Using the Data in Astro Pages

### Display All Member Projects

```astro
---
// src/pages/members.astro
import { getCollection } from 'astro:content';

const memberProjects = await getCollection('organizations',
  (org) => org.data.isMemberProject
);
---

<h1>Member Projects</h1>

{memberProjects.map((project) => (
  <div class="project-card">
    {project.data.logo && <img src={project.data.logo} alt={project.data.name} />}
    <h2>{project.data.name}</h2>
    <p>{project.data.description}</p>
    {project.data.website && (
      <a href={project.data.website}>Visit Website</a>
    )}
    <div class="tags">
      {project.data.tags.map((tag) => (
        <span class="tag">{tag}</span>
      ))}
    </div>
  </div>
))}
```

### Display Marketplace Offers

```astro
---
// src/pages/marketplace.astro
import { getCollection, getEntry } from 'astro:content';

const activeOffers = await getCollection('offers',
  (offer) => offer.data.status === 'active' && offer.data.availability === 'InStock'
);
---

<h1>Marketplace</h1>

{activeOffers.map((offer) => (
  <div class="offer-card">
    {offer.data.image && <img src={offer.data.image} alt={offer.data.name} />}
    <h2>{offer.data.name}</h2>
    <p>{offer.data.description}</p>

    <div class="price">
      {offer.data.price} {offer.data.priceCurrency}
    </div>

    {offer.data.sellerName && (
      <div class="seller">
        Sold by: {offer.data.sellerName}
      </div>
    )}

    {offer.data.url && (
      <a href={offer.data.url}>View Offer</a>
    )}
  </div>
))}
```

### Display Organization with Their Offers

```astro
---
// src/pages/organizations/[...slug].astro
import { getCollection, getEntry } from 'astro:content';

export async function getStaticPaths() {
  const organizations = await getCollection('organizations');
  return organizations.map((org) => ({
    params: { slug: org.data.slug || org.id },
    props: { org },
  }));
}

const { org } = Astro.props;

// Get all offers from this organization
const orgOffers = await getCollection('offers',
  (offer) => offer.data.seller === org.id
);
---

<article>
  <header>
    {org.data.banner && <img src={org.data.banner} alt="" class="banner" />}
    {org.data.logo && <img src={org.data.logo} alt={org.data.name} class="logo" />}
    <h1>{org.data.name}</h1>
    <p class="description">{org.data.description}</p>
  </header>

  {org.data.content && (
    <div class="content" set:html={org.data.content} />
  )}

  {orgOffers.length > 0 && (
    <section class="offers">
      <h2>Marketplace Offerings</h2>
      <div class="offers-grid">
        {orgOffers.map((offer) => (
          <div class="offer-card">
            <h3>{offer.data.name}</h3>
            <p>{offer.data.description}</p>
            <div class="price">{offer.data.price} {offer.data.priceCurrency}</div>
          </div>
        ))}
      </div>
    </section>
  )}

  <aside>
    <h2>Details</h2>
    <dl>
      {org.data.website && (
        <>
          <dt>Website</dt>
          <dd><a href={org.data.website}>{org.data.website}</a></dd>
        </>
      )}
      {org.data.ensName && (
        <>
          <dt>ENS</dt>
          <dd>{org.data.ensName}</dd>
        </>
      )}
      <dt>Type</dt>
      <dd>
        {org.data.isMemberProject && <span>Member Project</span>}
        {org.data.isAngelMinter && <span>Angel Minter</span>}
      </dd>
    </dl>
  </aside>
</article>
```

### Display Contributors with Hats Roles

```astro
---
// src/pages/contributors.astro
import { getCollection } from 'astro:content';

const contributors = await getCollection('contributors',
  (c) => c.data.isActive
);

// Group by organization
const byOrg = contributors.reduce((acc, contributor) => {
  for (const org of contributor.data.organizations) {
    if (!acc[org]) acc[org] = [];
    acc[org].push(contributor);
  }
  return acc;
}, {} as Record<string, typeof contributors>);
---

<h1>Contributors</h1>

{Object.entries(byOrg).map(([orgId, orgContributors]) => (
  <section>
    <h2>{orgId}</h2>
    <div class="contributors-grid">
      {orgContributors.map((contributor) => (
        <div class="contributor-card">
          {contributor.data.avatar && (
            <img src={contributor.data.avatar} alt={contributor.data.name} />
          )}
          <h3>{contributor.data.name}</h3>
          {contributor.data.bio && <p>{contributor.data.bio}</p>}

          {contributor.data.hatsRoles.length > 0 && (
            <div class="hats-roles">
              <strong>Roles:</strong>
              {contributor.data.hatsRoles.map((role) => (
                <span class="role-badge">{role.hatName}</span>
              ))}
            </div>
          )}

          <div class="social-links">
            {contributor.data.githubUsername && (
              <a href={`https://github.com/${contributor.data.githubUsername}`}>
                GitHub
              </a>
            )}
            {contributor.data.twitter && (
              <a href={`https://twitter.com/${contributor.data.twitter}`}>
                Twitter
              </a>
            )}
            {contributor.data.website && (
              <a href={contributor.data.website}>Website</a>
            )}
          </div>
        </div>
      ))}
    </div>
  </section>
))}
```

### Using Contributors for Author Credits

```astro
---
// In a blog post or docs page
import { getEntry } from 'astro:content';

const author = await getEntry('contributors', 'alice');
---

<footer class="article-footer">
  <div class="author-info">
    {author?.data.avatar && (
      <img src={author.data.avatar} alt={author.data.name} class="avatar" />
    )}
    <div>
      <strong>Written by {author?.data.name}</strong>
      {author?.data.bio && <p>{author.data.bio}</p>}
    </div>
  </div>
</footer>
```

## Field Reference

### Required Fields (Organizations)

- `id` - Unique identifier
- `name` - Display name
- `description` - Short description
- `isMemberProject` - Boolean flag
- `isAngelMinter` - Boolean flag

### Required Fields (Offers)

- `id` - Unique identifier
- `name` - Display name
- `description` - Short description

### Required Fields (Contributors)

- `id` - Unique identifier
- `name` - Display name

All other fields are optional and will use defaults from the schema.

## Tips

1. **IDs should be unique** - Use lowercase, kebab-case (e.g., `my-project`)
2. **Use slugs for URLs** - Auto-generated from name if not provided
3. **Markdown content** - Can include full markdown for detail pages
4. **Dates in ISO 8601** - Format: `2024-11-14T00:00:00Z`
5. **URLs must be valid** - Schema validates URL format
6. **Tags are arrays** - Even for single tags: `["tag"]`
7. **Seller references** - Offers should reference organization IDs via `seller` field
8. **Price currencies** - Use ISO 4217 codes (USD, EUR, ETH, etc.)
9. **Availability values** - Use schema.org values: InStock, OutOfStock, PreOrder, Discontinued, LimitedAvailability
