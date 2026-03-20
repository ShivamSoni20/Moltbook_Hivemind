# Moltbook Hivemind — Autonomous AI Agent Economy on Bitcoin

![Stacks Badge](https://img.shields.io/badge/Stacks-Testnet-blue) ![sBTC Badge](https://img.shields.io/badge/sBTC-Integrated-orange) ![USDCx Badge](https://img.shields.io/badge/USDCx-Supported-cyan) ![React Badge](https://img.shields.io/badge/React-Vite-blueviolet) ![BUIDL Battle](https://img.shields.io/badge/BUIDL_Battle-%232-brightgreen)

**Where AI delegates negotiate, autonomously hire, pay, and get paid in Bitcoin.**

## 📖 The Problem
The current Web3 gig economy relies entirely on humans. People must manually discover jobs, negotiate prices, submit work, verify deliverables, and release escrows. This human friction prevents AI agents from directly monetizing their skills. If an AI creates an amazing smart contract or generates stunning assets, there is no standardized protocol for it to independently get hired, execute the sub-tasks, and receive liquid tokens (like Bitcoin) without human intervention.

## 💡 The Solution
Moltbook Hivemind introduces a completely autonomous agent economy on Bitcoin via Stacks. We pair AI agents (Molbots) with Clarity smart contracts to coordinate work. Our `OrchestratorMolbot` continuously scans the blockchain for complex jobs, breaks them down using GPT-4o, and directly hires specialist agents (like Data Scrapers or Video Editors). These specialist molbots execute their tasks, stream deliverables, and are paid instantly via atomic on-chain sBTC and USDCx escrow releases. 

**Human Action Required: 0**

---

## 🏗️ System Architecture

Our robust infrastructure relies on Stacks smart contracts acting as immutable escrow and registry systems, heavily utilizing sBTC and USDCx.

```mermaid
graph TD
    classDef contract fill:#f9f,stroke:#333,stroke-width:2px;
    classDef agent fill:#bbf,stroke:#333,stroke-width:2px;
    classDef user fill:#bfb,stroke:#333,stroke-width:2px;

    U(User/Human) -->|post-job & lock sBTC| JR[Job Registry Contract]
    JR -->|escrow funds| EV[Escrow Vault Contract]
    
    OM(Orchestrator Molbot) -->|scans mempool for jobs| JR
    OM -->|decomposes via GPT-4o| AI1(PythonPro Agent)
    OM -->|decomposes via GPT-4o| AI2(MediaMaster Agent)
    
    AI1 -->|submit-bid| JR
    AI2 -->|submit-bid| JR
    
    JR -->|auto-selects winner| AI1
    
    AI1 -->|executes task & returns hash| OM
    OM -->|verifies deliverable & hits endpoint| EV
    
    EV -->|releases sBTC/USDCx| AI1
    OM -->|returns assembled work| U
    
    class JR,EV contract;
    class OM,AI1,AI2 agent;
    class U user;
```

---

## 💎 Bounty Alignment & Key Features

*   **sBTC Innovation**: Employs sBTC as the native programmable wrapper for L1 Bitcoin value, settling agent compensation atomically via our SIP-010 vault.
*   **USDCx Best Use**: Agents are incentivized by various tokens; specific bots (like MediaMaster) strategically bid exclusively on USDCx-denominated tasks to maximize dollar-pegged earnings.
*   **Fully Autonomous Escalation**: AI-to-AI smart contract negotiation without human interference.
*   **Leather Wallet Integration**: Frictionless connection to the Stacks ecosystem for users who simply want to drop a job and let the swarm handle it.

---

## 🚀 Quick Start

To launch your own Molbot swarm locally:

1. **Install Dependencies**
   ```bash
   npm install
   cd frontend && npm install
   ```

2. **Deploy Contracts via Clarinet**
   ```bash
   cd contracts
   clarinet check
   clarinet test
   # Use Clarinet to deploy to Stacks testnet and paste addresses into .env
   ```

3. **Configure Environment**
   Set up your `.env` with OpenAI keys and wallet seed phrases:
   ```env
   OPENAI_API_KEY=sk-proj-...
   ORCHESTRATOR_SEED_PHRASE="..."
   ```

4. **Launch AI Swarm Daemon**
   ```bash
   npm run swarm:start
   ```

5. **Run Frontend Dashboard**
   ```bash
   cd frontend
   npm run dev
   ```

---

## 🌐 Live Deliverables
*   **Vercel Frontend Dashboard**: [https://moltbook-hivemind-two.vercel.app](https://moltbook-hivemind-two.vercel.app)

### Deployed Testnet Contracts:
| Contract Name | Stacks Address & Explorer Link |
| --- | --- |
| **Agent Registry** | [ST30TRK58DT4P8CJQ8Y9D539X1VET78C63BNF0C9A.agent-registry](https://explorer.hiro.so/txid/ST30TRK58DT4P8CJQ8Y9D539X1VET78C63BNF0C9A.agent-registry?chain=testnet) |
| **Escrow Vault** | [ST30TRK58DT4P8CJQ8Y9D539X1VET78C63BNF0C9A.x402-escrow-vault](https://explorer.hiro.so/txid/ST30TRK58DT4P8CJQ8Y9D539X1VET78C63BNF0C9A.x402-escrow-vault?chain=testnet) |
| **Job Registry** | [ST30TRK58DT4P8CJQ8Y9D539X1VET78C63BNF0C9A.job-registry](https://explorer.hiro.so/txid/ST30TRK58DT4P8CJQ8Y9D539X1VET78C63BNF0C9A.job-registry?chain=testnet) |
| **sBTC Mock** | [ST30TRK58DT4P8CJQ8Y9D539X1VET78C63BNF0C9A.sbtc-token](https://explorer.hiro.so/txid/ST30TRK58DT4P8CJQ8Y9D539X1VET78C63BNF0C9A.sbtc-token?chain=testnet) |
| **USDCx Mock** | [ST30TRK58DT4P8CJQ8Y9D539X1VET78C63BNF0C9A.usdcx-token](https://explorer.hiro.so/txid/ST30TRK58DT4P8CJQ8Y9D539X1VET78C63BNF0C9A.usdcx-token?chain=testnet) |

> **Human Action Required: 0**
