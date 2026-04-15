# SakhiLend: Empowering Rural Women Entrepreneurs via Algorand

**SakhiLend** is a decentralized micro-lending and inflation-hedged savings protocol designed specifically for unbanked women (Sakhis) in rural India.

### 🌟 Vision
"Rural Indian women face zero credit access and high inflation. SakhiLend leverages Algorand for microloans and 6% USDC yields, empowering unbanked Sakhis with transparent and efficient global DeFi impact."

---

## 🛑 The Problem
Millions of rural women entrepreneurs in India are trapped in a cycle of financial exclusion:
1.  **Zero Credit Access**: Without formal credit history, they are rejected by banks and forced to use informal lenders charging 30-100% APR.
2.  **Inflation Erosion**: Local currency savings are eroded by inflation, making it impossible to build long-term capital for business growth.
3.  **Lack of Transparency**: Informal "Chit Funds" or local committees lack the security and transparency needed to scale.

## ✅ The Solution
SakhiLend bridges the gap between global DeFi capital and rural entrepreneurs using the Algorand blockchain:
*   **P2P Microloans**: Affordable micro-credit (₹500 - ₹50,000) for buying livestock, seeds, or small business stock.
*   **DigiSavings (Yield Vault)**: A USDC-based savings vault providing a steady 6% APY, protecting user capital from currency devaluation.
*   **Decentralized Trust Scoring**: A smart contract-based Oracle that builds a "Sakhi Trust Score" based on blockchain repayment behavior, enabling future collateral-free lending.

---

## 🛠️ Technical Implementation

### Core Technology Stack
*   **Blockchain**: Algorand (Testnet)
*   **Smart Contracts**: TypeScript (AVM) via AlgoKit & Puya TS
*   **Frontend**: Next.js 15, Tailwind CSS, Radix UI
*   **State Management**: Algorand **Box Storage** for efficient, scalable user data
*   **Asset Support**: USDC (Testnet ID: 758817439)

### Smart Contract Logic
1.  **LoanPool**: Handles loan disbursement, interest calculation, and repayment logic. Uses Box Storage to map loans to borrowers without hitting global state limits.
2.  **YieldVault**: A yield-bearing engine that calculates accruals per-block using the AVM's high precision. It allows Sakhis to deposit USDC and watch their balance grow in real-time.
3.  **TrustOracle**: Acts as a decentralized credit bureau, updating user risk profiles as they interact with the protocol.

---

## 🔗 Deployed Contracts (Algorand Testnet)

| Component | Application ID / Link |
| :--- | :--- |
| **Loan Pool** | [758818609](https://testnet.explorer.perawallet.app/application/758818609/) |
| **Yield Vault** | [758818613](https://testnet.explorer.perawallet.app/application/758818613/) |
| **Trust Oracle** | [758818612](https://testnet.explorer.perawallet.app/application/758818612/) |
| **USDC Asset** | [758817439](https://testnet.explorer.perawallet.app/asset/758817439/) |

---

## 🐙 GitHub Repositories
*   **Frontend & DApp**: [Sakhi-Lend Web](https://github.com/SakhiLend/sakhi-lend)
*   **Smart Contracts**: [Sakhi-Lend Contracts](https://github.com/SakhiLend/sakhi-lend-contracts)

---

## 🚀 How to Run Locally

### Prerequisites
*   Node.js v20+
*   Algorand LocalNet (from AlgoKit)

### Setup
1. Clone the repo: `git clone https://github.com/SakhiLend/sakhi-lend.git`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Deploy contracts to localnet: `cd contracts && algokit project deploy localnet`
