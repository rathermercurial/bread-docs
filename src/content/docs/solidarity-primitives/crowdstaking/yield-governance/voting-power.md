---
title: Understanding Bread Voting Power
slug: voting-power
---
# Understanding BREAD Voting Power

🔒 [Liquidity Provider Voting Vaults](/solidarity-primitives/crowdstaking/yield-governance/lp-vaults/)

In the Bread Cooperative governance smart contracts, **voting power accumulation is based on the user's amount of BREAD per block.**

All voting power for governance votes experiences a delay as a safety precaution. As shown in the image, voting power accumulated this month can be used to vote next month. i.e., voting power accumulated in January can be used to vote in February.

![voting-power-timeline](/images/voting-power-timeline.webp)

When we consider the 5 second block times and considerable BREAD holdings with each user, representing this voting power simply becomes a challenge.

![voting-power-calculation](/images/voting-power-calculation.webp)

However, users still need to know how much voting power they have. We have created a simplified system that considers **the average amount of BREAD held over the month**. This is calculated by dividing the raw voting power by the number of blocks in the last voting period. This provides a standardised metric for understanding voting power.

![voting-power-display](/images/voting-power-display.webp)

:::caution[👉 Remember that the vote you submit only affects 50% of the yield disbursement decision as the other 50% is split evenly among all of the projects.]

🧠 [Yield Governance](/solidarity-primitives/crowdstaking/yield-governance/)
:::

## Examples / Scenarios

1. User holds 100 BREAD over the entirety of the previous month, not moving any of the BREAD
   a. VP = 100

2. User holds 100 BREAD for the first half of the month and then adds 100 more BREAD in the second half of the month
   a. VP = 150

3. User holds 100 BREAD one-third of the month, then spends 50 BREAD holds this for the second third, and then mints BREAD so they are holding 500 BREAD for the last third
   a. VP = 216.67

4. User was holding 100 BREAD the full previous month and then burned all of it at the start of the current month
   a. VP = 100

5. User was a BREAD holder in the past but burned all of their BREAD over a month ago
   a. VP = 0