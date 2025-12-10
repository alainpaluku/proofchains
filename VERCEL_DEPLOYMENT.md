# Déploiement Vercel - PROOFCHAIN Monorepo

Ce projet est un monorepo avec 4 applications Next.js. Chaque app doit être déployée comme un **projet Vercel séparé**.

## Prérequis

Le repo doit être connecté à GitHub: `https://github.com/alainpaluku/proofchain`

## Configuration pour chaque application

Créez **4 projets Vercel** avec les configurations suivantes:

### 1. Landing Page (proofchain-landing)

| Paramètre | Valeur |
|-----------|--------|
| **Root Directory** | `apps/landing` |
| **Framework Preset** | Next.js |
| **Build Command** | `cd ../.. && npm install && npm run build --workspace=@proofchain/landing` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |

### 2. Verifier (proofchain-verifier)

| Paramètre | Valeur |
|-----------|--------|
| **Root Directory** | `apps/verifier` |
| **Framework Preset** | Next.js |
| **Build Command** | `cd ../.. && npm install && npm run build --workspace=@proofchain/verifier` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |

### 3. Issuer (proofchain-issuer)

| Paramètre | Valeur |
|-----------|--------|
| **Root Directory** | `apps/issuer` |
| **Framework Preset** | Next.js |
| **Build Command** | `cd ../.. && npm install && npm run build --workspace=@proofchain/issuer` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |

### 4. Admin (proofchain-admin)

| Paramètre | Valeur |
|-----------|--------|
| **Root Directory** | `apps/admin` |
| **Framework Preset** | Next.js |
| **Build Command** | `cd ../.. && npm install && npm run build --workspace=@proofchain/admin` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |

## Variables d'environnement

Ajoutez ces variables dans chaque projet Vercel (Settings > Environment Variables):

```
NEXT_PUBLIC_BLOCKFROST_PROJECT_ID=votre_project_id
NEXT_PUBLIC_BLOCKFROST_NETWORK=preprod
NEXT_PUBLIC_CARDANO_EXPLORER=https://preprod.cardanoscan.io
NEXT_PUBLIC_PINATA_API_KEY=votre_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=votre_secret_key
NEXT_PUBLIC_SUPABASE_URL=votre_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
```

## Étapes de déploiement

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Add New Project"
3. Importez le repo `alainpaluku/proofchain`
4. Configurez selon le tableau ci-dessus pour chaque app
5. Ajoutez les variables d'environnement
6. Cliquez sur "Deploy"

## URLs de production (exemple)

- Landing: `https://proofchain-landing.vercel.app`
- Verifier: `https://proofchain-verifier.vercel.app`
- Issuer: `https://proofchain-issuer.vercel.app`
- Admin: `https://proofchain-admin.vercel.app`
