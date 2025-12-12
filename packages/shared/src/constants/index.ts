/**
 * PROOFCHAIN - Constants
 * Constantes globales de l'application
 */

// Admin
export const ADMIN_EMAIL = 'alainpaluku@proton.me';

// Institution Types
export const INSTITUTION_TYPES = {
    UN: 'Université',
    IS: 'Institut Supérieur',
    LC: 'Lycée/Collège',
    CF: 'Centre de Formation',
} as const;

// KYC Status
export const KYC_STATUS = {
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    incomplete: 'Incomplet',
} as const;

// Document Status
export const DOCUMENT_STATUS = {
    draft: 'Brouillon',
    issued: 'Émis',
    revoked: 'Révoqué',
} as const;

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
    free: 'Gratuit',
    basic: 'Basic',
    premium: 'Premium',
    enterprise: 'Enterprise',
} as const;

// Cardano Networks
export const CARDANO_NETWORKS = {
    mainnet: {
        name: 'Mainnet',
        blockfrostUrl: 'https://cardano-mainnet.blockfrost.io/api/v0',
        explorerUrl: 'https://cardanoscan.io',
    },
    preprod: {
        name: 'Preprod',
        blockfrostUrl: 'https://cardano-preprod.blockfrost.io/api/v0',
        explorerUrl: 'https://preprod.cardanoscan.io',
    },
} as const;

// IPFS Gateways
export const IPFS_GATEWAYS = [
    'https://gateway.pinata.cloud/ipfs/',
    'https://ipfs.io/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
] as const;

// Validation Limits
export const LIMITS = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxStudentsPerImport: 1000,
    maxDocumentsPerBatch: 50,
    minPasswordLength: 8,
    maxNameLength: 255,
} as const;

// Date Formats
export const DATE_FORMATS = {
    display: 'DD/MM/YYYY',
    api: 'YYYY-MM-DD',
    full: 'DD MMMM YYYY',
} as const;
