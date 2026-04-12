# SakhiLend + DigiSavings

SakhiLend + DigiSavings is a two-sided women's financial platform built on Algorand Testnet.

### SakhiLend
SakhiLend is a P2P microlending marketplace where global lenders fund loans to verified Mann Deshi borrowers. Borrower profiles are anonymized but TTF-score-verified on-chain. Smart contracts auto-disburse test USDC loans, track repayments, and reward lenders with simulated yield — demonstrating the full credit pipe on top of Mann Deshi's existing scorecard infrastructure.

### DigiSavings
DigiSavings is a UPI-linked yield savings simulator for the same women. They deposit a simulated INR amount → converts to test USDC on Algorand Testnet → earns simulated yield → withdrawable anytime. Returns are shown in local relatable language — "aaj aapne ₹3.20 kamaye — ek chai ki kimat" — removing all Web3 complexity.

Together they close the full loop: borrow when you need, save when you can.

## Features
- **Savings & Yield**: Deploy a simple yield vault contract on testnet that accepts test USDC deposits and simulates a fixed APY (e.g., 6% annualized) — accrued per block, withdrawable anytime.
- **UPI Simulation**: Mock the INR ↔ USDC conversion with a simple frontend toggle — user enters ₹500, system shows equivalent test USDC. No real payment gateway needed for testnet.
- **Role-Based Access**: Specialized dashboards for Borrowers, Lenders, and Savers.
- **Algorand Integration**: Real-time block tracking and on-chain yield calculation.

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS, Radix UI.
- **Blockchain**: Algorand Testnet.
- **Smart Contracts**: Puya TS (TypeScript-to-TEAL).
- **Wallet**: @txnlab/use-wallet-react.
