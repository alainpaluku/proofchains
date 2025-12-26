/**
 * PROOFCHAIN - Wallet Icons
 * SVG icons for supported Cardano wallets
 */

import React from 'react';

interface IconProps {
    className?: string;
}

export const EternlIcon: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#1A44B7"/>
        <path d="M50 15L20 35v30l30 20 30-20V35L50 15z" fill="#fff"/>
        <path d="M50 30L35 40v15l15 10 15-10V40L50 30z" fill="#1A44B7"/>
        <circle cx="50" cy="50" r="8" fill="#fff"/>
    </svg>
);

export const EternlMobileIcon: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#1A44B7"/>
        <rect x="30" y="15" width="40" height="70" rx="6" fill="#fff"/>
        <rect x="35" y="22" width="30" height="50" rx="3" fill="#1A44B7"/>
        <circle cx="50" cy="78" r="4" fill="#1A44B7"/>
        <path d="M50 35L40 42v10l10 7 10-7V42L50 35z" fill="#fff"/>
    </svg>
);

export const LaceIcon: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#3D5AFE"/>
        <path d="M50 20L25 35v30l25 15 25-15V35L50 20z" fill="#fff"/>
        <path d="M50 35L38 43v14l12 8 12-8V43L50 35z" fill="#3D5AFE"/>
    </svg>
);

export const NamiIcon: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#349EA3"/>
        <path d="M25 70V30l25 20-25 20z" fill="#fff"/>
        <path d="M50 50l25-20v40L50 50z" fill="#fff"/>
    </svg>
);

export const LaceMobileIcon: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#3D5AFE"/>
        <rect x="30" y="15" width="40" height="70" rx="6" fill="#fff"/>
        <rect x="35" y="22" width="30" height="50" rx="3" fill="#3D5AFE"/>
        <circle cx="50" cy="78" r="4" fill="#3D5AFE"/>
        <path d="M50 35L40 42v10l10 7 10-7V42L50 35z" fill="#fff"/>
    </svg>
);

export const WalletIconMap: Record<string, React.FC<IconProps>> = {
    eternl: EternlIcon,
    'eternl-mobile': EternlMobileIcon,
    lace: LaceIcon,
    'lace-mobile': LaceMobileIcon,
    nami: NamiIcon,
};

export default WalletIconMap;
