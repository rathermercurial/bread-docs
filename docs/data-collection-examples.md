# Data Collection Examples

This document provides example data files for organizations and contributors collections.

## Organizations Collection

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
  "isMarketplace": false,

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

### Example 2: Markdown Format (Marketplace Only)

**File:** `data/organizations/marketplace-example.md`

```markdown
---
id: marketplace-example
name: Example Marketplace
description: A decentralized marketplace for community goods
isMemberProject: false
isAngelMinter: false
isMarketplace: true
website: https://marketplace.example
tags: [marketplace, e-commerce]
status: active
---

# Example Marketplace

This is an example of a marketplace listing using Markdown format.

## About

The markdown content section can contain detailed information about the marketplace,
including features, how to use it, and other relevant details.

## Features

- Feature 1: Decentralized listings
- Feature 2: Community governance
- Feature 3: Token-gated access

## How to Join

Instructions for becoming a vendor or customer...
```

### Example 3: JSON Format (All Three Types)

**File:** `data/organizations/hybrid-project.json`

```json
{
  "id": "hybrid-project",
  "name": "Hybrid Project",
  "description": "An organization that serves multiple roles in the ecosystem",

  "isMemberProject": true,
  "isAngelMinter": true,
  "isMarketplace": true,

  "website": "https://hybrid.example",
  "ethereumAddress": "0x9876543210987654321098765432109876543210",

  "tags": ["multi-role", "ecosystem"],
  "status": "active"
}
```

### Example 4: Markdown Format (Member Project)

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
isMarketplace: false
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

## Contributors Collection

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
organizations: [breadchain, hybrid-project]
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
  "organizations": ["breadchain", "community-project", "hybrid-project"],

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

### Display Organization Detail Page

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
        {org.data.isMarketplace && <span>Marketplace</span>}
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
- `isMarketplace` - Boolean flag

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
