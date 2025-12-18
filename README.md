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
| 🏠 Landing | 3003 | [landing-rouge-phi.vercel.app](https://landing-rouge-phi.vercel.app/) | [apps/landing](./apps/landing) |
| ✅ Verifier | 3000 | [proofchain-verifier.vercel.app](https://proofchain-verifier.vercel.app) | [apps/verifier](./apps/verifier) |
| 🎓 Issuer | 3001 | [proofchain-issuer.vercel.app](https://proofchain-issuer.vercel.app) | [apps/issuer](./apps/issuer) |
| ⚙️ Admin | 3002 | [proofchain-admin.vercel.app](https://proofchain-admin.vercel.app) | [apps/admin](./apps/admin) |

---

## 🚀 Démarrage rapide

```bash
# Installation
npm install

# Développement (toutes les apps)
npm run dev

# App spécifique
npm run issuer:dev
npm run verifier:dev
npm run admin:dev
```

---

## 🏗️ Architecture

| Dossier | Description |
|---------|-------------|
| [apps/landing](./apps/landing) | Landing page publique |
| [apps/verifier](./apps/verifier) | Vérification de diplômes |
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
| Wallets | Eternl, Eternl Mobile, Lace, Nami |
| Storage | IPFS via Pinata |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Monorepo | Turborepo |
| Deploy | Vercel |

---

## 💳 Wallets supportés

| Wallet | Type | Statut |
|--------|------|--------|
| Eternl | Extension | ✅ Supporté |
| Eternl Mobile | iOS/Android | ✅ Supporté |
| Lace | Extension | ✅ Supporté |
| Nami | Extension | ✅ Supporté |

Voir l'implémentation : [packages/ui/src/hooks/useWallet.ts](./packages/ui/src/hooks/useWallet.ts)

---

## 🔧 Commandes

Voir [package.json](./package.json) pour toutes les commandes.

### Développement
```bash
npm run dev              # Toutes les apps
npm run issuer:dev       # Issuer uniquement
npm run verifier:dev     # Verifier uniquement
npm run admin:dev        # Admin uniquement
npm run landing:dev      # Landing uniquement
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
NEXT_PUBLIC_VERIFIER_URL=https://proofchain-verifier.vercel.app
NEXT_PUBLIC_ISSUER_URL=https://proofchain-issuer.vercel.app
NEXT_PUBLIC_ADMIN_URL=https://proofchain-admin.vercel.app
```

> ⚠️ Ne jamais commiter les fichiers `.env`

---

## ✨ Fonctionnalités

### Pour les institutions ([Issuer](./apps/issuer))
- 🎓 Émission de diplômes NFT sur Cardano
- 📋 Gestion des étudiants
- 📊 Dashboard avec statistiques
- 🔐 Authentification sécurisée

### Pour la vérification ([Verifier](./apps/verifier))
- � Scsan QR code
- � Recherche cpar ID document
- ✅ Vérification blockchain en temps réel
- 📄 Affichage des métadonnées

### Administration ([Admin](./apps/admin))
- ✅ Validation KYC des institutions
- � Stfatistiques globales
- 👥 Gestion des utilisateurs
- 💳 Gestion des abonnements

---

## � Sécuritdé

Voir [.gitignore](./.gitignore) - Fichiers exclus de Git :
- `.env`, `.env.local`
- `.vscode/`
- `node_modules/`

---

## 📄 License

© 2024 PROOFCHAIN - Tous droits réservés
