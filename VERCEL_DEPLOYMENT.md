# 🚀 Déploiement sur Vercel

Guide pour déployer les 3 applications ProofChain sur Vercel.

## 📋 Prérequis

- Compte Vercel (gratuit)
- Repository GitHub connecté à Vercel

## 🏗️ Architecture

```
proofchaines/
├── apps/
│   ├── verifier/    ← App 1 (Port 3000 en local)
│   ├── issuer/      ← App 2 (Port 3001 en local)
│   └── admin/       ← App 3 (Port 3002 en local)
└── packages/        ← Packages partagés
```

Chaque app sera déployée comme un **projet Vercel séparé**.

---

## 📝 Étapes de déploiement

### 1. Accéder à Vercel

1. Va sur [vercel.com](https://vercel.com)
2. Connecte-toi avec ton compte GitHub
3. Clique sur **"Add New..."** → **"Project"**

### 2. Importer le repository

1. Sélectionne le repository **`palukuba/proofchaines`**
2. Clique sur **"Import"**

### 3. Configuration du projet

#### Pour l'app **Verifier** :

| Paramètre | Valeur |
|-----------|--------|
| **Project Name** | `proofchain-verifier` |
| **Framework Preset** | `Next.js` |
| **Root Directory** | `apps/verifier` |
| **Build Command** | `npm run build` (ou laisser par défaut) |
| **Output Directory** | Laisser par défaut |

**⚠️ IMPORTANT :**

Clique sur **"Root Directory"** → **"Edit"** et sélectionne :
```
apps/verifier
```

#### Pour l'app **Issuer** :

| Paramètre | Valeur |
|-----------|--------|
| **Project Name** | `proofchain-issuer` |
| **Framework Preset** | `Next.js` |
| **Root Directory** | `apps/issuer` |

#### Pour l'app **Admin** :

| Paramètre | Valeur |
|-----------|--------|
| **Project Name** | `proofchain-admin` |
| **Framework Preset** | `Next.js` |
| **Root Directory** | `apps/admin` |

---

## 🔐 Variables d'environnement

Dans **Settings > Environment Variables**, ajoute :

### Variables Verifier

| Variable | Environnement |
|----------|---------------|
| `NEXT_PUBLIC_BLOCKFROST_PROJECT_ID` | Production, Preview, Development |
| `NEXT_PUBLIC_BLOCKFROST_NETWORK` | `preprod` |
| `NEXT_PUBLIC_CARDANO_EXPLORER` | `https://preprod.cardanoscan.io` |

### Variables Issuer

| Variable | Environnement |
|----------|---------------|
| `NEXT_PUBLIC_BLOCKFROST_PROJECT_ID` | Production, Preview, Development |
| `NEXT_PUBLIC_BLOCKFROST_NETWORK` | `preprod` |
| `NEXT_PUBLIC_PINATA_API_KEY` | Production, Preview, Development |
| `NEXT_PUBLIC_PINATA_SECRET_KEY` | Production, Preview, Development |

### Variables Admin

| Variable | Environnement |
|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development |

---

## ⚙️ Configuration Next.js pour Vercel

Les fichiers `next.config.js` doivent être configurés pour Vercel (pas d'export statique).

Modifie chaque `next.config.js` pour retirer `output: 'export'` :

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@proofchain/ui', '@proofchain/chain', '@proofchain/shared'],
    images: {
        domains: ['gateway.pinata.cloud', 'ipfs.io'],
    },
};

module.exports = nextConfig;
```

---

## 🌐 URLs de déploiement

Après déploiement, tu auras :

- **Verifier** : `https://proofchain-verifier.vercel.app`
- **Issuer** : `https://proofchain-issuer.vercel.app`
- **Admin** : `https://proofchain-admin.vercel.app`

---

## 🔄 Déploiements automatiques

- Chaque push sur `main` → Déploiement en **Production**
- Chaque push sur une autre branche → Déploiement **Preview**
- Chaque Pull Request → URL de preview automatique

---

## 🔗 Domaines personnalisés

1. Va dans **Settings > Domains**
2. Ajoute ton domaine personnalisé
3. Configure les DNS selon les instructions Vercel

Exemple :
- `verifier.proofchain.io` → proofchain-verifier.vercel.app
- `issuer.proofchain.io` → proofchain-issuer.vercel.app
- `admin.proofchain.io` → proofchain-admin.vercel.app

---

## 📊 Monorepo avec Turborepo

Vercel détecte automatiquement Turborepo. Pour optimiser les builds :

1. Va dans **Settings > General**
2. Active **"Include source files outside of the Root Directory"**
3. Cela permet d'accéder aux packages partagés (`packages/*`)

---

## ❓ Résolution de problèmes

### Erreur "Module not found: @proofchain/ui"
→ Active l'option "Include source files outside of the Root Directory"

### Erreur "Build failed - Node version"
→ Dans Settings > General, définis Node.js Version sur `20.x`

### Erreur avec les routes dynamiques
→ Vercel supporte nativement les routes dynamiques, pas besoin de query params

### Erreur "WASM not supported"
→ Ajoute dans `next.config.js` :
```javascript
webpack: (config) => {
    config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
    };
    return config;
},
```

---

## 🆚 Vercel vs Cloudflare Pages

| Fonctionnalité | Vercel | Cloudflare Pages |
|----------------|--------|------------------|
| Routes dynamiques | ✅ Natif | ⚠️ Edge Runtime requis |
| SSR | ✅ Complet | ⚠️ Limité |
| API Routes | ✅ Serverless | ⚠️ Workers |
| WASM | ✅ Supporté | ⚠️ Limité |
| Prix | Gratuit (limité) | Gratuit (généreux) |

**Recommandation** : Vercel est plus adapté pour ce projet Next.js avec routes dynamiques et WASM (lucid-cardano).

---

## 📞 Support

- [Documentation Vercel](https://vercel.com/docs)
- [Guide Monorepo Vercel](https://vercel.com/docs/monorepos)
- [Next.js sur Vercel](https://vercel.com/docs/frameworks/nextjs)
