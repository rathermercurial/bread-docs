---
# Entity (Thing) properties
name: ""
description: ""
url: ""
image: ""
identifier: "" # Organization registry ID or Ethereum address
sameAs: []

# Organization properties
legalName: ""
alternateName: ""
logo: ""
member: []
parentOrganization: ""
subOrganization: []
email: ""

# Flags
isMemberProject: false
isAngelMinter: false

# Relationships
makesOffer: []
---

# {{NAME}}

## About

[Brief description of the organization]

## Mission

[Mission statement and core values]

## What We Do

[Main activities, services, or products]

## Projects

- [Project 1]
- [Project 2]
- [Project 3]

## Members

[Information about membership or key members]

## Get Involved

[How people can participate or support]

## Contact

- Website:
- Email:
- Social:

---

## Notes

**How to use this template:**

1. Fill in the frontmatter fields (the YAML between `---` markers)
2. Replace {{NAME}} with the organization's name
3. Fill in the content sections
4. Save the file in `data/organization/` directory with a slug-friendly filename (e.g., `breadchain-cooperative.md`)

**Frontmatter field guide:**

- `name`: Organization name (REQUIRED)
- `description`: One-sentence description
- `url`: Organization website
- `image`: Path to logo or banner image
- `identifier`: Unique ID (Ethereum address, registry number, etc.)
- `sameAs`: Array of URLs (GitHub, Twitter, website, etc.)
  ```yaml
  sameAs:
    - "https://github.com/organization"
    - "https://twitter.com/org"
  ```
- `legalName`: Official registered name (if different from `name`)
- `alternateName`: Short name or abbreviation
- `logo`: Path to logo file (e.g., `/attachments/logo.svg`)
- `member`: Array of people who are members
  ```yaml
  member:
    - alice-chen
    - bob-garcia
    - "External Member Name"
  ```
- `parentOrganization`: Parent org slug (e.g., `breadchain-cooperative`)
- `subOrganization`: Array of sub-organization slugs
- `makesOffer`: Array of offer slugs
  ```yaml
  makesOffer:
    - wholesale-produce
    - community-csa
  ```
- `isMemberProject`: Set to `true` if this is a Breadchain member project
- `isAngelMinter`: Set to `true` if this org is an Angel Minter

**Wikilinks:**
- Link to people: `[[Alice Chen]]` or `[[alice-chen]]`
- Link to other organizations: `[[Parent Organization]]`
- Link to offers: `[[Wholesale Produce]]`
