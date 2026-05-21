---
title: Yield Governance
---

The Bread Cooperative Network is funded by users baking BREAD by giving xDAI which is then converted into sDAI (a yield bearing asset) which BREAD holders can then vote on how the yield is distributed among [member projects](/solidarity-primitives/crowdstaking/member-projects/). In this way, our yield governance is similar to a credit union, except in this credit union we make it completely transparent where people are able to vote in 30-day cycles where to put the yield generated towards and can still use their money through BREAD. Since the general ethos of the Bread Cooperative Network is geared towards post-capitalism, it’s like a **post-capitalist credit union** that uses participatory budgeting.

[Participatory budgeting](https://en.wikipedia.org/wiki/Participatory_budgeting) is a common method for progressive municipalities, cooperatives and similarly democratic organizations to decide how to split up a budget by giving voice to members of the community. Here our community members are BREAD token holders. Our post-capitalist values are also embedded in the smart contracts themselves that facilitate the voting and movement of capital which is why we would describe it as a **[solidarity primitive](https://breadchain.mirror.xyz/nwQx4CqPAcwZ5zSNB2_K25N1quOF1NGcKaYcS3S33CA)**. You can also find a more concrete example of how the results can look like in our system [here](https://breadchain.mirror.xyz/BMIPx1uJozXLoSTY1bBq5ua6X3qS8qZf5rXUC_fKdjo).

**Note that the exact technical specifications for how this all works can be found in our [Github](https://github.com/breadchaincoop)**.

# How Yield Distribution Works

Bread Cooperative combines 1) a pre-determined disbursement with 2) token voting at a 50:50 ratio of the total disbursement. 1 is meant to be the most direct way of not allowing the influence of capital to determine everything, and 2 is meant to help encourage the creation of BREAD among supporters of each project. Disbursement runs on a 30-day cycle and is settled on-chain through Bread Cooperative's own [governance smart contracts](https://github.com/breadchaincoop) — voting and distribution are coordinated through [app.breadchain.xyz/governance](https://app.breadchain.xyz/governance).

This makes a clear incentive for why projects would want to become a Bread member project and gives an opening for more people to take part in the project as supporters.

## Pre-Determined

Half of the disbursed funds are evenly split among the current [member projects](/solidarity-primitives/crowdstaking/member-projects/):

- Bread Coop Core
- Symbiota
- Crypto Commons Association
- Citizen Wallet
- Regen Coordination
- Traditional Dream Factory
- Gardens
- Solidarity Fund Treasury

You can always see the live list and current voting cycle at [fund.bread.coop/governance](https://fund.bread.coop/governance).

## Token Voting

The other half of the yield disbursement is determined through **token voting** weighted by [BREAD voting power](/solidarity-primitives/crowdstaking/yield-governance/voting-power/). Voting power is based on the average amount of BREAD held over the previous 30-day cycle, so it cannot be gamed by buying BREAD right before a vote. Liquidity providers can preserve their voting power through the [LP Voting Vaults](/solidarity-primitives/crowdstaking/yield-governance/lp-vaults/).

Each cycle, holders distribute 100 percentage points among the listed projects to express how they want their half of the yield disbursed.

## Example

Monthly Yield = 200 BREAD

Pre-determined Disbursement = 100 BREAD split evenly across member projects

Token Voting = 100 BREAD spread based on the vote

Example Vote and Disbursement:

- Crypto Commons Association = 25% = 25 BREAD
- Symbiota = 40% = 40 BREAD
- Regen Coordination = 15% = 15 BREAD
- Bread Coop Core = 20% = 20 BREAD

# Future Potential Additions

We treat the above as the MVP. Below is a growing list of potential upgrades we are considering for future versions.

## Multi-Token Weighted Voting

We can change the weighting of the power of BREAD holders’ votes if they hold other tokens including NFTs, POAPs, etc. that we have available for holders to purchase based on their past support of the project.

For example we could already airdrop a POAP for all members of the Bread Cooperative Guild that gives them some kind of multiplier for votes. This would reward those who have supported Bread Cooperative thus far. This scheme can also be customized over time to either find better fits or to have certain themes for each month that make votes slightly more dynamic and allow for certain groups slightly more votes. It can be a way to experiment in different ways.

## External Project Inclusion Proposal Staking

While there is a clear group of projects included in every vote (official Bread member projects), we could allow a way for outside projects who believe that they are aligned to **include themselves through a process of staking** (let’s say for now) 10k BREAD. By staking this amount for one month, they can be included in the vote for projects. The number staked needs to be high enough to not dilute the choices and push people to gain support from others to collectively stake for inclusion, which in turn helps increase the total yield for all projects. If the number is high for someone who wishes to be included, this pushes them to take part in making contacts with people in the community to raise the money for the stake.

This could be done for outside projects or even for specific initiatives that supporters would like to see happen. This in turn makes the line more clear as well as the incentive in becoming a member project. By becoming a member you don’t need to go through this process but otherwise you do. It also forms a signal that perhaps some projects with a lot of support should become member projects.

Note that importantly the BREAD staked cannot be used for voting — it is simply a proposal for inclusion.
