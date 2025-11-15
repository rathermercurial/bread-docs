---
# Entity (Thing) properties
name: ""
description: ""
url: ""
image: ""
identifier: "" # Ethereum address (0x...)
sameAs: []

# Person properties
givenName: ""
familyName: ""
additionalName: ""
jobTitle: ""
memberOf: []
worksFor: []
email: ""

# Web3 identity
ensName: ""
ensAvatar: ""

# Flags
isContributor: false
isAngelMinter: false

# Relationships
makesOffer: []
---

# {{NAME}}

## About

[Brief description of the person]

## Background

[Professional background, experience, how they got involved]

## Contributions

[Specific contributions to Breadchain or other projects]

## Skills & Expertise

- [Skill 1]
- [Skill 2]
- [Skill 3]

## Contact

- Email:
- Website:
- Social:

---

## Notes

**How to use this template:**

1. Fill in the frontmatter fields (the YAML between `---` markers)
2. Replace {{NAME}} with the person's name
3. Fill in the content sections below
4. Save the file in `data/person/` directory with a slug-friendly filename (e.g., `alice-chen.md`)

**Frontmatter field guide:**

- `name`: Full name (REQUIRED)
- `description`: One-sentence description
- `url`: Personal website or portfolio
- `image`: Path to profile photo (e.g., `/attachments/alice-photo.jpg`)
- `identifier`: Ethereum address for web3 identity
- `sameAs`: Array of URLs (GitHub, Twitter, LinkedIn, etc.)
  ```yaml
  sameAs:
    - "https://github.com/username"
    - "https://twitter.com/username"
  ```
- `memberOf`: Array of organizations (use wikilink format or organization slug)
  ```yaml
  memberOf:
    - breadchain-cooperative
    - local-harvest-coop
  ```
- `makesOffer`: Array of offer slugs
  ```yaml
  makesOffer:
    - web-development-services
    - consulting
  ```
- `isContributor`: Set to `true` if this person contributes to Breadchain
- `isAngelMinter`: Set to `true` if this person is an Angel Minter

**Wikilinks:**
- Link to organizations: `[[Breadchain Cooperative]]` or `[[breadchain-cooperative]]`
- Link to other people: `[[Alice Chen]]` or `[[alice-chen]]`
- Link to offers: `[[Web Development Services]]`
