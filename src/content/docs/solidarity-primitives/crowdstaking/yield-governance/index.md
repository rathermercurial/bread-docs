---
title: Yield Governance
sidebar:
  order: 0
---

The Bread Cooperative Network is funded by users baking BREAD by giving xDAI which is then converted into sDAI (a yield bearing asset) which BREAD holders can then vote on how the yield is distributed among [member projects](/member-projects/). In this way, our yield governance is similar to a credit union, except in this credit union we make it completely transparent where people are able to vote in 30-day cycles where to put the yield generated towards and can still use their money through BREAD. Since the general ethos of the Bread Cooperative Network is geared towards post-capitalism, it’s like a **post-capitalist credit union** that uses participatory budgeting.

[Participatory budgeting](https://en.wikipedia.org/wiki/Participatory_budgeting) is a common method for progressive municipalities, cooperatives and similarly democratic organizations to decide how to split up a budget by giving voice to members of the community. Here our community members are BREAD token holders. Our post-capitalist values are also embedded in the smart contracts themselves that facilitate the voting and movement of capital which is why we would describe it as a **[solidarity primitive](https://breadchain.mirror.xyz/nwQx4CqPAcwZ5zSNB2_K25N1quOF1NGcKaYcS3S33CA)**. You can also find a more concrete example of how the results can look like in our system [here](https://breadchain.mirror.xyz/BMIPx1uJozXLoSTY1bBq5ua6X3qS8qZf5rXUC_fKdjo).

**Note that the exact technical specifications for how this all works can be found in our [Github](https://github.com/breadchaincoop)**.

# Version 0 Outline

For v0, we use PowerPool to combine a 1) pre-determined disbursement with 2) token voting at a 50:50 ratio of the total disbursement. 1 is meant to be the most direct way of not allowing the influence of capital to determine everything and 2 is meant to help encourage the creation of BREAD among supporters of each project. A monthly automated disbursement based on the combination of these 2 methods would be our goal using PowerPool.

This would make a more clear incentive for why projects would want to become a Bread project and give an opening for more people to take part in the project as supporters. While this arrangement can likely be improved, we believe it is a good start for a v0 and leaves enough room for future improvements.

## Pre-Determined

Half of the disbursed funds will be evenly split among 5 entities:

- Shared Bread Treasury
- Crypto Commons Association
- Symbiota Coop
- Labor DAO
- Bread Devs Treasury

  

## Token Voting

The other half of the yield disbursement would be determined through **simple token voting** where one BREAD is equal to one vote. Based on a **snapshot of BREAD holders, each month** will be a vote for holders to vote on how they would like the funds to be disbursed. BREAD holders could distribute 100 percentage points among all of the listed projects to disburse their yield.

While this on its own would not be ideal, it does help incentivize BREAD baking by those who want to support specific projects or want to take part in that process. We are also protected by having a limited set of projects that can be voted on so that there is not a way for someone to steal half of our yield by baking a lot of BREAD for a month and then leaving.

## Example

Monthly Yield = 200 BREAD

Pre-determined Disbursement = 100 BREAD split at 20 BREAD for each entity

Toke Voting = 100 BREAD spread based on vote

Example Vote and Disbursement:

- Crypto Commons Association = 25% = 25 BREAD
- Symbiota Coop = 40% = 40 BREAD
- Labor DAO = 15% - 15 BREAD
- Bread Devs Treasury = 20% = 20 BREAD

# Future Potential Additions

While it may be possible to already add these features, let’s consider the above as the MVP. We have potential upgrades to be considered for next versions. You can find a growing list of potential features were are considering adding.

## Multi-Token Weighted Voting

We can change the weighting of the power of BREAD holders’ votes if they hold other tokens including NFTs, POAPs, etc. that we have available for holders to purchase based on their past support of the project.

For example we could already airdrop a POAP for all members of the Bread Cooperative Guild that gives them some kind of multiplier for votes. This would reward those who have support Bread Cooperative thus far. This scheme can also be customized over time to either find better fits or to have certain themes for each month that make votes slightly more dynamic and allow for certain groups slightly more votes. Can be a way to experiment in different ways.

## External Project Inclusion Proposal Staking

While there is a clear group of projects included in every vote (official Bread member projects), we could allow a way for outside projects who believe that they are aligned to **include themselves through a process of staking** (let’s say for now) 10k BREAD. By staking this amount for one month, they can be included in the vote for projects. The number staked needs to be high enough to not dilute the choices and push people to gain support from others to collectively stake for inclusion which in turn helps increase the total yield for all projects. If the number is high for someone who wishes to be included, this pushes them to take part in making contacts with people in the community to raise the money for the stake.

This could be done for outside projects or even for specific initiatives that supporters would like to see happen. This in turn makes the line more clear as well as the incentive in becoming a member project. By becoming a member you don’t need to go through this process but otherwise you do. It also forms as a signal that perhaps some projects with a lot of support should become member projects.

Note that importantly the BREAD staked cannot be used for voting, it is simply a proposal for inclusion.