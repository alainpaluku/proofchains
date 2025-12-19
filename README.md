# 🔐 PROOFCHAIN

**Plateforme de certification académique sur blockchain Cardano**

Émettez, vérifiez et authentifiez des diplômes sous forme de NFT immuables et infalsifiables.

[![Cardano](https://img.shields.io/badge/Cardano-Preprod-blue)](https://cardano.org)
[![Next.js](https://img.shields.io/badge/Next.js-13-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://typescriptlang.org)

---

## 📦 Applications

| App | Port | URL | Code |
|-----|------|-----|------|
| 🏠 Landing (+ Verifier) | 3003 | [proofchains.org](https://proofchains.org) | [apps/landing](./apps/landing) |
| 🎓 Issuer | 3001 | [issuer.proofchains.org](https://issuer.proofchains.org) | [apps/issuer](./apps/issuer) |
| ⚙️ Admin | 3002 | [admin.proofchains.org](https://admin.proofchains.org) | [apps/admin](./apps/admin) |

---

## 🚀 Démarrage rapide

```bash
# Installation
npm install

# Développement (toutes les apps)
npm run dev

# App spécifique
npm run issuer:dev
npm run admin:dev
```

---

## 🏗️ Architecture

| Dossier | Description |
|---------|-------------|
| [apps/landing](./apps/landing) | Landing page + Vérification de diplômes |
| [apps/issuer](./apps/issuer) | Portail institutions |
| [apps/admin](./apps/admin) | Dashboard administration |
| [packages/ui](./packages/ui) | Composants React partagés |
| [packages/shared](./packages/shared) | Services, hooks, types |
| [packages/chain](./packages/chain) | SDK Cardano (mint, verify) |
| [scripts](./scripts) | Scripts de déploiement |
| [supabase](./supabase) | Schéma SQL |

---

## 🎨 Stack technique

| Catégorie | Technologies |
|-----------|-------------|
| Frontend | Next.js 13, React 18, Tailwind CSS |
| Language | TypeScript 5.3 |
| Blockchain | Cardano, Lucid, Blockfrost API |
| Wallets | Eternl, Lace |
| Storage | IPFS via Pinata |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Monorepo | Turborepo |
| Deploy | Vercel |

---

## 💳 Wallets supportés

| Wallet | Type | Statut |
|--------|------|--------|
| Eternl | Extension Desktop | ✅ Supporté |
| Eternl | Mobile (iOS/Android) | ✅ Supporté |
| Lace | Extension Desktop | ✅ Supporté |

Sur mobile, l'app redirige vers le navigateur dApp intégré d'Eternl.

Voir l'implémentation : [packages/ui/src/hooks/useWallet.ts](./packages/ui/src/hooks/useWallet.ts)

---

## 🔧 Commandes

Voir [package.json](./package.json) pour toutes les commandes.

### Développement
```bash
npm run dev              # Toutes les apps
npm run issuer:dev       # Issuer uniquement
npm run admin:dev        # Admin uniquement
npm run landing:dev      # Landing uniquement (inclut la vérification)
```

### Build & Lint
```bash
npm run build            # Build production
npm run lint             # ESLint
npm run clean            # Nettoyer les builds
```

### Déploiement Vercel
Voir [scripts/deploy.ps1](./scripts/deploy.ps1)
```bash
npm run deploy           # Preview (toutes les apps)
npm run deploy:prod      # Production (toutes les apps)
```

---

## ⚙️ Configuration

Créer un fichier `.env` à la racine (voir [.env.example](./.env) pour le format) :

```env
# === Supabase ===
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# === Cardano / Blockfrost ===
NEXT_PUBLIC_BLOCKFROST_PROJECT_ID=preprodXXX
NEXT_PUBLIC_BLOCKFROST_NETWORK=preprod

# === IPFS / Pinata ===
PINATA_JWT=eyJxxx...

# === URLs des apps ===
NEXT_PUBLIC_LANDING_URL=https://proofchains.org
NEXT_PUBLIC_ISSUER_URL=https://issuer.proofchains.org
NEXT_PUBLIC_ADMIN_URL=https://admin.proofchains.org
```

> ⚠️ Ne jamais commiter les fichiers `.env`

---

## ✨ Fonctionnalités

### Pour les institutions ([Issuer](./apps/issuer))
- 🎓 Émission de diplômes NFT sur Cardano
- 📋 Gestion des étudiants
- 📊 Dashboard avec statistiques
- 🔐 Authentification sécurisée

### Pour la vérification (intégré dans [Landing](./apps/landing))
- 🔍 Recherche par ID document ou Asset ID
- ✅ Vérification blockchain en temps réel
- 📄 Affichage des métadonnées du diplôme

### Administration ([Admin](./apps/admin))
- ✅ Validation KYC des institutions
- 📊 Statistiques globales
- 👥 Gestion des utilisateurs
- 💳 Gestion des abonnements

---

## 🔒 Sécurité

Voir [.gitignore](./.gitignore) - Fichiers exclus de Git :
- `.env`, `.env.local`
- `.vscode/`
- `node_modules/`

---

## 📄 License

MIT License - Voir [LICENSE](./LICENSE)
