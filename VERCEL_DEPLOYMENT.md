# Déploiement Vercel - PROOFCHAIN Monorepo

Ce projet est un monorepo avec 4 applications Next.js. Chaque app doit être déployée comme un **projet Vercel séparé**.

## ⚠️ IMPORTANT - Configuration Root Directory

Quand vous importez le repo, Vercel détecte automatiquement les sous-dossiers et propose de sélectionner `apps/admin`, `apps/issuer`, etc.

**NE SÉLECTIONNEZ PAS UN SOUS-DOSSIER!**

Cherchez l'option pour importer depuis la **racine du repo** (Root Directory = `.` ou vide).

## Configuration pour chaque application

Créez **4 projets Vercel** en important le repo `alainpaluku/proofchain`:

### 1. Landing Page (proofchain-landing)

| Paramètre | Valeur |
|-----------|--------|
| **Root Directory** | `.` (racine - NE PAS sélectionner apps/landing) |
| **Framework Preset** | Next.js |
| **Install Command** | `npm install` |
| **Build Command** | `npx turbo run build --filter=@proofchain/landing` |
| **Output Directory** | `apps/landing/.next` |

### 2. Verifier (proofchain-verifier)

| Paramètre | Valeur |
|-----------|--------|
| **Root Directory** | `.` (racine - NE PAS sélectionner apps/verifier) |
| **Framework Preset** | Next.js |
| **Install Command** | `npm install` |
| **Build Command** | `npx turbo run build --filter=@proofchain/verifier` |
| **Output Directory** | `apps/verifier/.next` |

### 3. Issuer (proofchain-issuer)

| Paramètre | Valeur |
|-----------|--------|
| **Root Directory** | `.` (racine - NE PAS sélectionner apps/issuer) |
| **Framework Preset** | Next.js |
| **Install Command** | `npm install` |
| **Build Command** | `npx turbo run build --filter=@proofchain/issuer` |
| **Output Directory** | `apps/issuer/.next` |

### 4. Admin (proofchain-admin)

| Paramètre | Valeur |
|-----------|--------|
| **Root Directory** | `.` (racine - NE PAS sélectionner apps/admin) |
| **Framework Preset** | Next.js |
| **Install Command** | `npm install` |
| **Build Command** | `npx turbo run build --filter=@proofchain/admin` |
| **Output Directory** | `apps/admin/.next` |

## Variables d'environnement

Ajoutez ces variables dans chaque projet (Settings > Environment Variables):

```
NEXT_PUBLIC_BLOCKFROST_PROJECT_ID=votre_project_id
NEXT_PUBLIC_BLOCKFROST_NETWORK=preprod
NEXT_PUBLIC_CARDANO_EXPLORER=https://preprod.cardanoscan.io
NEXT_PUBLIC_PINATA_API_KEY=votre_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=votre_secret_key
NEXT_PUBLIC_SUPABASE_URL=votre_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
```

## Étapes détaillées

1. Allez sur [vercel.com](https://vercel.com) → "Add New Project"
2. Sélectionnez le repo `alainpaluku/proofchain`
3. **ATTENTION**: Vercel va proposer plusieurs dossiers détectés
   - **NE CLIQUEZ PAS** sur apps/admin ou autre sous-dossier
   - Cherchez "Import" ou "Continue" pour garder la racine
4. Dans "Configure Project":
   - Vérifiez que Root Directory = `.` ou vide
   - Install Command: `npm install`
   - Build Command: selon l'app (voir tableaux ci-dessus)
   - Output Directory: selon l'app (voir tableaux ci-dessus)
5. Ajoutez les variables d'environnement
6. Cliquez "Deploy"

## Vérification

Si vous voyez `npm install --prefix=../..` dans les logs d'erreur, cela signifie que le Root Directory n'est PAS à la racine. Supprimez le projet et recommencez en gardant la racine.
