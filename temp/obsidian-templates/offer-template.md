---
name: ""
description: ""
offeredBy: "" # person or organization slug
itemOffered: ""
price: ""
priceCurrency: "USD"
availability: "" # InStock, OutOfStock, PreOrder, etc.
validFrom: "" # YYYY-MM-DD (optional)
validThrough: "" # YYYY-MM-DD (optional)
url: ""
image: ""
category: []
---

# {{NAME}}

## Overview

[Brief overview of what's being offered]

## Details

[Detailed description of the offer]

## Pricing

[Pricing information, payment options, etc.]

## How to Get This

[Process for purchasing or accessing the offer]

## Contact

[Contact information for inquiries]

---

## Notes

**How to use this template:**

1. Fill in the frontmatter fields
2. Replace {{NAME}} with the offer name
3. Fill in content sections
4. Save in `data/offer/` directory with a slug-friendly filename (e.g., `web-services.md`)

**Frontmatter field guide:**

- `name`: Offer name/title (REQUIRED)
- `description`: One-sentence description
- `offeredBy`: Person or organization slug (REQUIRED)
  ```yaml
  offeredBy: alice-chen
  # OR
  offeredBy: breadchain-cooperative
  ```
- `itemOffered`: Description of what's being offered (REQUIRED)
- `price`: Price information (can be range, "Contact for pricing", etc.)
- `priceCurrency`: ISO currency code (USD, EUR, ETH, etc.)
- `availability`: Current status
  - Options: `InStock`, `OutOfStock`, `PreOrder`, `Discontinued`, `OnlineOnly`, `InStoreOnly`, `LimitedAvailability`
- `validFrom`: When offer becomes valid (format: `2025-01-01`)
- `validThrough`: When offer expires (format: `2025-12-31`)
- `url`: URL for more information or to purchase
- `image`: Path to offer image
- `category`: Array of categories
  ```yaml
  category:
    - web-services
    - development
    - cooperative-tech
  ```

**Common category tags:**
- `web-services`, `development`, `design`, `consulting`
- `food`, `wholesale`, `retail`, `organic`
- `cryptocurrency`, `governance`, `tokens`
- `education`, `training`, `workshops`
- `cooperative-tech`, `mutual-aid`, `solidarity-economy`

**Wikilinks:**
- Link to provider: `[[Alice Chen]]` or `[[Breadchain Cooperative]]`
- Link to related offers: `[[Related Offer]]`
