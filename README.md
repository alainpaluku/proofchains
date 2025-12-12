# 🔐 PROOFCHAIN

Plateforme de vérification et d'émission de diplômes académiques sur la blockchain Cardano.

## 📦 Applications

| App | Port | Description |
|-----|------|-------------|
| Landing | 3003 | Page d'accueil publique |
| Verifier | 3000 | Vérification de diplômes |
| Issuer | 3001 | Émission de diplômes (institutions) |
| Admin | 3002 | Administration plateforme |

## 🚀 Démarrage

```bash
npm install
npm run dev
```

## 🏗️ Architecture

```
proofchain/
├── apps/
│   ├── landing/       # Landing page
│   ├── verifier/      # Vérification publique
│   ├── issuer/        # Portail institutions
│   └── admin/         # Administration
├── packages/
│   ├── ui/            # Composants UI partagés
│   ├── shared/        # Services et logique métier
│   └── chain/         # Intégration Cardano
└── supabase/          # Schéma base de données
```

## 🎨 Stack

- **Framework**: Next.js 15, React 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Blockchain**: Cardano (Blockfrost)
- **Storage**: IPFS (Pinata)
- **Database**: Supabase (PostgreSQL)
- **Monorepo**: Turborepo

## 🔧 Commandes

```bash
npm run dev              # Toutes les apps
npm run verifier:dev     # Verifier uniquement
npm run issuer:dev       # Issuer uniquement
npm run admin:dev        # Admin uniquement
npm run build            # Build production
npm run lint             # Linting
```

## � Configuration

Créer `.env` à la racine :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Blockfrost (Cardano)
NEXT_PUBLIC_BLOCKFROST_PROJECT_ID=your_project_id
NEXT_PUBLIC_BLOCKFROST_NETWORK=preprod
NEXT_PUBLIC_CARDANO_EXPLORER=https://preprod.cardanoscan.io

# Pinata (IPFS)
PINATA_JWT=your_jwt
NEXT_PUBLIC_PINATA_JWT=your_jwt

# URLs
NEXT_PUBLIC_VERIFIER_URL=https://your-verifier.vercel.app
NEXT_PUBLIC_ISSUER_URL=https://your-issuer.vercel.app
NEXT_PUBLIC_ADMIN_URL=https://your-admin.vercel.app
```

## � Fonctionnalités

- ✅ Émission de diplômes NFT sur Cardano
- ✅ Vérification par QR code ou ID document
- ✅ Validation KYC des institutions
- ✅ Stockage IPFS des documents
- ✅ Dashboard admin avec statistiques
- ✅ Authentification Supabase

## 📄 License

Propriétaire - PROOFCHAIN
