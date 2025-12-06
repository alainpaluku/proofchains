# 🚀 Déploiement sur Cloudflare Pages

Guide pour déployer les 3 applications ProofChain sur Cloudflare Pages.

## 📋 Prérequis

- Compte Cloudflare (gratuit)
- Repository GitHub connecté à Cloudflare

## 🏗️ Architecture

```
proofchaines/
├── apps/
│   ├── verifier/    ← App 1 (Port 3000 en local)
│   ├── issuer/      ← App 2 (Port 3001 en local)
│   └── admin/       ← App 3 (Port 3002 en local)
└── packages/        ← Packages partagés
```

Chaque app sera déployée comme un **projet Cloudflare Pages séparé**.

---

## 📝 Étapes de déploiement

### 1. Accéder à Cloudflare Pages

1. Va sur [dash.cloudflare.com](https://dash.cloudflare.com)
2. Dans le menu de gauche, clique sur **"Workers & Pages"**
3. Clique sur **"Create"** puis **"Pages"**
4. Sélectionne **"Connect to Git"**

### 2. Connecter le repository

1. Autorise Cloudflare à accéder à ton GitHub
2. Sélectionne le repository **`palukuba/proofchaines`**
3. Clique sur **"Begin setup"**

### 3. Configuration du build

#### Pour l'app **Verifier** :

| Paramètre | Valeur |
|-----------|--------|
| **Project name** | `proofchain-verifier` |
| **Production branch** | `main` |
| **Framework preset** | `Next.js (Static HTML Export)` |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |

**⚠️ IMPORTANT - Paramètres avancés :**

Clique sur **"Root directory (advanced)"** et entre :
```
apps/verifier
```

#### Pour l'app **Issuer** :

| Paramètre | Valeur |
|-----------|--------|
| **Project name** | `proofchain-issuer` |
| **Production branch** | `main` |
| **Framework preset** | `Next.js (Static HTML Export)` |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |

**Root directory (advanced)** :
```
apps/issuer
```

#### Pour l'app **Admin** :

| Paramètre | Valeur |
|-----------|--------|
| **Project name** | `proofchain-admin` |
| **Production branch** | `main` |
| **Framework preset** | `Next.js (Static HTML Export)` |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |

**Root directory (advanced)** :
```
apps/admin
```

---

## 🔐 Variables d'environnement

Dans **Settings > Environment variables**, ajoute :

### Variables communes (toutes les apps)

| Variable | Valeur |
|----------|--------|
| `NODE_VERSION` | `20` |

### Variables Verifier

| Variable | Valeur |
|----------|--------|
| `NEXT_PUBLIC_BLOCKFROST_PROJECT_ID` | `ta_clé_blockfrost` |
| `NEXT_PUBLIC_BLOCKFROST_NETWORK` | `preprod` |
| `NEXT_PUBLIC_CARDANO_EXPLORER` | `https://preprod.cardanoscan.io` |

### Variables Issuer (en plus)

| Variable | Valeur |
|----------|--------|
| `NEXT_PUBLIC_PINATA_API_KEY` | `ta_clé_pinata` |
| `NEXT_PUBLIC_PINATA_SECRET_KEY` | `ton_secret_pinata` |

---

## 🌐 URLs de déploiement

Après déploiement, tu auras :

- **Verifier** : `https://proofchain-verifier.pages.dev`
- **Issuer** : `https://proofchain-issuer.pages.dev`
- **Admin** : `https://proofchain-admin.pages.dev`

---

## 🔄 Déploiements automatiques

Chaque push sur la branche `main` déclenchera automatiquement un nouveau déploiement.

---

## ❓ Résolution de problèmes

### Erreur "Node version"
→ Ajoute `NODE_VERSION=20` dans les variables d'environnement

### Erreur "Build failed"
→ Vérifie que le **Root directory** est correct (`apps/verifier`, etc.)

### Erreur "Output directory not found"
→ Le **Build output directory** doit être `out` (pas `.next`)

### Erreur "Dynamic routes not supported"
→ Les routes dynamiques utilisent maintenant des query params (`/verify?assetId=xxx`)

---

## 📞 Support

Pour toute question, consulte la [documentation Cloudflare Pages](https://developers.cloudflare.com/pages/).
