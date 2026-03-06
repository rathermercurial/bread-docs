---
title: How to be good at EigenLayer
---

At Sourdough Systems / Bread Cooperative, we have been hard at work learning about “restaking” especially through the Eigen Layer protocol. Here are some basic resources and links that have been helpful for us to understand the space. This is also what we require developers working on Eigen Layer to review and understand in order to work on initiatives like [Gas Killer](/bread-cooperative/sourdough-systems/gas-killer/) which won the ETH Denver hackathon in 2025.

**A simple way to try to understand restaking is by comparing web2 and web3 services.**

## **What AVSs attempt to solve**

When you operate a traditional software service, for users to use your product *they need to trust** you're doing what you claim you're doing. It’s difficult to know exactly what happens after you press a button on a screen, especially if it’s not open source.  
  
For many applications, this trust assumption is reasonable, while for others it's not. For example, if a private company operated a cryptocurrency through a centrally owned digital ledger, its users would have to trust that company to not manipulate balances.  
  
Proof of Stake networks (such as Ethereum) manage to operate their core service (a digital ledger) in a trustless way by distributing the responsibilities of operation to multiple actors (Validators). These actors are economically incentivized to keep the integrity of its operation, thus **Ethereum is economically secured.** It would cost a significant amount of money and resources to hurt the integrity of the Ethereum blockchain.  
  
**Actively Validated Services (AVS)** generalize the Economic Security mechanics of Proof of Stake (PoS) networks to simply be services that **need Economic Security to be reliable.** EigenLayer is building an infrastructural layer on top of Ethereum that allows AVSs to use the stake used for PoS offered by Operators to secure these services. Operators earn rewards for successfully providing these services built on EigenLayer.

![image 19](/images/image%2019.webp)

## Glossary

- _**Staking**_ - a fundamental component of how the Ethereum blockchain works through its consensus mechanism Proof of Stake, staking is the act of putting up ether as collateral for the right to run a validator to secure the Ethereum network which earns rewards. To become a validator, Ethereum users must “stake” 32 ETH. Staked Ether is locked and inaccessible, and is only released once the user stops running their validator node or “withdraws”.
- _**Restaking**_ - the act of committing already staked assets on Ethereum in the case of EigenLayer for the opportunity to earn more rewards. There are two forms of restaking on EigenLayer. In the first, users can stake supported liquid staking tokens. In the second, which is known as native restaking and only available to users with full Ethereum validator credentials, existing staked Ether is redeployed via EigenLayer’s proprietary smart contracts.
- **Actively Validated Service (AVS)** - decentralized services that utilize the EigenLayer protocol. It is composed of on-chain contracts for verification and an off-chain network of Operators that execute it. Tasks can be initiated via on-chain contracts, off-chain via direct communication with the Operators, or via a task aggregator entity.
- **Operators** - execute the software for running an AVS and put up the stake required to run it. Operators (restakers) on EigenLayer are like validators on Ethereum, by attesting that transactions are correct or incorrect on AVSs they are validating, allowing each application to function, and receive rewards in return.
- **Operator Sets** - determine which Operators secure an AVS and earn rewards. AVSs group Operators into Operator Sets based on unique business logic, hardware profiles, liveness guarantees, or composition of stake. A single AVS can have multiple Operator Sets that run the same or similar services. EigenLayer provides a high level of flexibility for this
- **Delegators / Restakers** - give stake (often in ether or an ether liquid staking token) to Operators who run AVSs and get a split of the rewards generated.
- **Cryptoeconomic Security** - Ethereum is one of the most economically secure decentralized networks since there are billions of dollars worth of ether staked for validating Ethereum through PoS. EigenLayer offers “Cryptoeconomic Security as a Service” by allowing Ethereum stakers to validate more decentralized services with the same stake.
- **Rewards** - tokens distributed to Retakers and Operators by the protocol of the AVS to reward Restakers and Operators for participation in securing AVSs.
- **Slashing** - a penalty determined by an AVS as a deterrent for broken commitments by Operators. Broken commitments may include improperly or inaccurately completing tasks assigned by an AVS. Slashing results in a burning/loss of funds. No / very few AVSs have slashing at the time of writing and Ethereum is the only protocol to have it implemented.

## Concept Overview from EigenLayer

:::note[AVS Overview | EigenLayer]
What is an Autonomous Verifiable Service (AVS)?  
[https://docs.eigenlayer.xyz/developers/Concepts/avs-developer-guide](https://docs.eigenlayer.xyz/developers/Concepts/avs-developer-guide)  
:::

![image 1 3](/images/image%201%203.webp)

## Example of AVS

You would like to start a new decentralized protocol but are not looking forward to trying to attract new capital for your service to run. So instead you use EigenLayer to build an AVS that borrows the cryptoeconomic security of Ethereum to secure your protocol. You set up your protocol to attract Restakers / Operators who put up their Ethereum stake in order to validate your new protocol and earn rewards. You’ve now been able to attract much more economic security in a faster time than if you tried bootstrapping from scratch.

You can find a growing list of AVSs being built on EigenLayer on [Eigen Explorer](https://dashboard.eigenexplorer.com/).

If you want an example of an AVS that we’re building out ourselves, check out [Gas Killer](/bread-cooperative/sourdough-systems/gas-killer/)!

## Recommended Reading

**You Could've Invented EigenLayer -** [https://www.blog.eigenlayer.xyz/ycie/](https://www.blog.eigenlayer.xyz/ycie/)

Thread on cryptoeconomic coprocessor - [https://x.com/sreeramkannan/status/1730310412904599714](https://x.com/sreeramkannan/status/1730310412904599714)

EigenLayer Docs - [https://docs.eigenlayer.xyz/developers/Concepts/avs-developer-guide](https://docs.eigenlayer.xyz/developers/Concepts/avs-developer-guide)

### BLS Optimization

[https://www.othentic.xyz/post/revamping-bls](https://www.othentic.xyz/post/revamping-bls)

## Videos

**EigenLayer AVS Deep Dives -** [https://www.youtube.com/playlist?list=PL9sM6KtdZxrXrYF7Hf97M6QtUzk8iM2Uv](https://www.youtube.com/playlist?list=PL9sM6KtdZxrXrYF7Hf97M6QtUzk8iM2Uv)

**Official EigenLayer Playlist -** [https://www.youtube.com/playlist?list=PL9sM6KtdZxrXMgMq4aBHaRnWaXlcJTiVj](https://www.youtube.com/playlist?list=PL9sM6KtdZxrXMgMq4aBHaRnWaXlcJTiVj)

## Resources to keep up with Restaking

Re:Staking Weekly Newsletter - [https://www.restakingweekly.com/](https://www.restakingweekly.com/)

EigenLayer Podcast - [https://www.youtube.com/@0xcoordinated/videos](https://www.youtube.com/@0xcoordinated/videos)

Nader Dabit (DevRel at EigenLayer) - [https://x.com/dabit3](https://x.com/dabit3)