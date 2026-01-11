<div align="center">

# PROOFCHAINS

**Blockchain-Powered Academic Certification Platform on Cardano**

Issue, verify, and authenticate diplomas as immutable and tamper-proof NFTs.

[![Cardano](https://img.shields.io/badge/Cardano-Preprod-0033AD?style=for-the-badge&logo=cardano)](https://cardano.org)
[![Next.js](https://img.shields.io/badge/Next.js-13-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](./LICENSE)

<img src="https://raw.githubusercontent.com/cardano-foundation/brand-assets/main/Cardano%20Logo/PNG/Cardano-RGB_Logo-Full-Blue.png" alt="Cardano" width="400"/>

</div>

---

## TABLE OF CONTENTS

- [Overview](#overview)
- [Applications](#applications)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Commands](#commands)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Supported Wallets](#supported-wallets)
- [Features](#features)
- [Documentation](#documentation)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## OVERVIEW

<div align="center">
<img src="https://img.icons8.com/fluency/96/certificate.png" alt="Certificate" width="80"/>
</div>

ProofChains is a comprehensive academic certification solution built on the Cardano blockchain. It enables institutions to issue diplomas as NFTs, ensuring permanent authenticity and traceability.

**Why ProofChains?**
- 🔐 **Immutable** — Certificates cannot be altered or forged
- ⚡ **Instant Verification** — Verify any diploma in seconds
- 🌍 **Global Access** — Accessible from anywhere in the world
- 💰 **Cost-Effective** — Low transaction fees on Cardano

---

## APPLICATIONS

<div align="center">

| Application | Port | URL | Source Code |
|:-----------:|:----:|:---:|:-----------:|
| <img src="https://img.icons8.com/fluency/48/home.png" width="24"/> Landing + Verifier | 3003 | [proofchains.org](https://proofchains.org) | [apps/landing](./apps/landing) |
| <img src="https://img.icons8.com/fluency/48/graduation-cap.png" width="24"/> Issuer Portal | 3001 | [issuer.proofchains.org](https://issuer.proofchains.org) | [apps/issuer](./apps/issuer) |
| <img src="https://img.icons8.com/fluency/48/settings.png" width="24"/> Admin Dashboard | 3002 | [admin.proofchains.org](https://admin.proofchains.org) | [apps/admin](./apps/admin) |

</div>

---

## PREREQUISITES

<div align="center">
<img src="https://img.icons8.com/fluency/96/checklist.png" alt="Checklist" width="80"/>
</div>

| Requirement | Version / Details |
|-------------|-------------------|
| **Node.js** | >= 18.x |
| **npm** | >= 9.x |
| **Supabase** | [supabase.com](https://supabase.com) account |
| **Blockfrost** | [blockfrost.io](https://blockfrost.io) API key (Preprod) |
| **Pinata** | [pinata.cloud](https://pinata.cloud) account for IPFS |
| **Wallet** | Eternl or Lace |

---

## INSTALLATION

<div align="center">
<img src="https://img.icons8.com/fluency/96/download.png" alt="Download" width="80"/>
</div>

```bash
# Clone the repository
git clone https://github.com/your-org/proofchains.git
cd proofchains

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
```

---

## CONFIGURATION

<div align="center">
<img src="https://img.icons8.com/fluency/96/settings.png" alt="Settings" width="80"/>
</div>

Create a `.env` file at the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Cardano / Blockfrost
NEXT_PUBLIC_BLOCKFROST_PROJECT_ID=preprodXXX
NEXT_PUBLIC_BLOCKFROST_NETWORK=preprod

# IPFS / Pinata
PINATA_JWT=eyJxxx...

# Application URLs
NEXT_PUBLIC_LANDING_URL=https://proofchains.org
NEXT_PUBLIC_ISSUER_URL=https://issuer.proofchains.org
NEXT_PUBLIC_ADMIN_URL=https://admin.proofchains.org
```

> ⚠️ **Warning**: Never commit `.env` files to the repository.

---

## COMMANDS

<div align="center">
<img src="https://img.icons8.com/fluency/96/console.png" alt="Console" width="80"/>
</div>

### Development

```bash
npm run dev              # Start all applications
npm run landing:dev      # Landing only
npm run issuer:dev       # Issuer only
npm run admin:dev        # Admin only
```

### Build & Quality

```bash
npm run build            # Production build
npm run lint             # ESLint check
npm run clean            # Clean builds
```

### Deployment

```bash
npm run deploy           # Preview (all apps)
npm run deploy:prod      # Production (all apps)
```

See [scripts/deploy.ps1](./scripts/deploy.ps1) for details.

---

## ARCHITECTURE

<div align="center">
<img src="https://img.icons8.com/fluency/96/folder-tree.png" alt="Architecture" width="80"/>
</div>

```
proofchains/
├── apps/
│   ├── landing/         # Landing page + diploma verification
│   ├── issuer/          # Institution portal
│   └── admin/           # Administration dashboard
├── packages/
│   ├── ui/              # Shared React components
│   ├── shared/          # Common services, hooks, types
│   └── chain/           # Cardano SDK (mint, verify)
├── scripts/             # Deployment scripts
└── supabase/            # SQL schema and migrations
```

---

## TECH STACK

<div align="center">
<img src="https://img.icons8.com/fluency/96/source-code.png" alt="Tech Stack" width="80"/>
</div>

<div align="center">

| Category | Technologies |
|:--------:|:------------:|
| **Frontend** | <img src="https://img.shields.io/badge/Next.js-000?logo=next.js" /> <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" /> <img src="https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white" /> |
| **Language** | <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" /> |
| **Blockchain** | <img src="https://img.shields.io/badge/Cardano-0033AD?logo=cardano&logoColor=white" /> Lucid, Blockfrost API |
| **Wallets** | Eternl, Lace |
| **Storage** | <img src="https://img.shields.io/badge/IPFS-65C2CB?logo=ipfs&logoColor=white" /> via Pinata |
| **Database** | <img src="https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white" /> (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Monorepo** | <img src="https://img.shields.io/badge/Turborepo-EF4444?logo=turborepo&logoColor=white" /> |
| **Deploy** | <img src="https://img.shields.io/badge/Vercel-000?logo=vercel" /> |

</div>

---

## SUPPORTED WALLETS

<div align="center">
<img src="https://img.icons8.com/fluency/96/wallet.png" alt="Wallet" width="80"/>
</div>

| Wallet | Platform | Status |
|:------:|:--------:|:------:|
| **Eternl** | Desktop Extension | ✅ Supported |
| **Eternl** | Mobile (iOS/Android) | ✅ Supported |
| **Lace** | Desktop Extension | ✅ Supported |

On mobile, the app automatically redirects to Eternl's built-in dApp browser.

Implementation: [packages/ui/src/hooks/useWallet.ts](./packages/ui/src/hooks/useWallet.ts)

---

## FEATURES

<div align="center">
<img src="https://img.icons8.com/fluency/96/star.png" alt="Features" width="80"/>
</div>

### Institution Portal (Issuer)

- Issue diploma NFTs on Cardano
- Manage students and cohorts
- Real-time statistics dashboard
- Secure authentication

### Public Verification (Landing)

- Search by document ID or Asset ID
- Instant blockchain verification
- Display diploma metadata

### Administration (Admin)

- Institution KYC validation
- Platform-wide statistics
- User management
- Subscription management

---

## DOCUMENTATION

<div align="center">
<img src="https://img.icons8.com/fluency/96/book.png" alt="Documentation" width="80"/>
</div>

The complete user guide is available:

**[User Guide (PDF)](./apps/landing/public/docs/guide-utilisation.pdf)**

Also accessible from the homepage under the "Documentation" section.

**Contents:**
- Introduction to ProofChains
- Issuing diplomas (institutions)
- Verifying diplomas
- Account management
- FAQ and troubleshooting

---

## SECURITY

<div align="center">
<img src="https://img.icons8.com/fluency/96/shield.png" alt="Security" width="80"/>
</div>

### Excluded Sensitive Files

The following files are excluded from versioning (see [.gitignore](./.gitignore)):

- `.env`, `.env.local`, `.env.*.local`
- `.vscode/`
- `node_modules/`

### Report a Vulnerability

If you discover a security vulnerability, please contact us directly at [security@proofchains.org](mailto:security@proofchains.org) rather than opening a public issue.

---

## CONTRIBUTING

<div align="center">
<img src="https://img.icons8.com/fluency/96/handshake.png" alt="Contributing" width="80"/>
</div>

Contributions are welcome! Please:

1. Fork the repository
2. Create a branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## LICENSE

<div align="center">
<img src="https://img.icons8.com/fluency/96/document.png" alt="License" width="80"/>
</div>

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

<div align="center">

<img src="https://img.icons8.com/fluency/96/blockchain-technology.png" alt="Blockchain" width="60"/>

**PROOFCHAINS**

*Certifying the future, one diploma at a time.*

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)](https://github.com/your-org/proofchains)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/proofchains)
[![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/proofchains)

</div>
