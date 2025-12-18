/**
 * PROOFCHAIN - Wallet Connection Hook
 * Supports Eternl and Lace wallets (desktop + mobile)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

interface WalletApi {
    getUsedAddresses: () => Promise<string[]>;
    getUnusedAddresses?: () => Promise<string[]>;
    getNetworkId: () => Promise<number>;
    getBalance: () => Promise<string>;
    signTx: (tx: string, partialSign?: boolean) => Promise<string>;
    submitTx: (tx: string) => Promise<string>;
}

export type WalletType = 'eternl' | 'eternl-mobile' | 'lace' | null;

export interface WalletState {
    connected: boolean;
    address: string | null;
    balance: string | null;
    network: 'mainnet' | 'preprod' | 'preview' | null;
    walletApi: WalletApi | null;
    walletType: WalletType;
    isLoading: boolean;
    error: string | null;
}

export interface WalletInfo {
    id: WalletType;
    name: string;
    icon: string;
    installed: boolean;
    isMobile?: boolean;
    deepLink?: string;
    appStoreUrl?: string;
    playStoreUrl?: string;
}

// Helper to get cardano from window
function getCardano() {
    if (typeof window === 'undefined') return undefined;
    return (window as any).cardano;
}

// Check if running on mobile
function isMobileDevice() {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Check if iOS
function isIOSDevice() {
    if (typeof window === 'undefined') return false;
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Check if in Eternl's in-app browser
function isInEternlBrowser() {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent.toLowerCase();
    // Eternl injecte son wallet même dans le navigateur in-app
    return ua.includes('eternl') || (isMobileDevice() && getCardano()?.eternl);
}

// Helper to detect Eternl wallet (handles different property names)
function getEternlWallet() {
    const cardano = getCardano();
    if (!cardano) return null;
    // Eternl peut être injecté sous 'eternl' ou 'ccvault' (ancien nom)
    return cardano.eternl || cardano.ccvault || null;
}

// Parse CBOR balance to ADA
function parseCborBalance(balanceCbor: string): number {
    try {
        if (balanceCbor.startsWith('1b')) {
            // Grand entier (8 bytes)
            return parseInt(balanceCbor.slice(2, 18), 16) / 1_000_000;
        } else if (balanceCbor.startsWith('1a')) {
            // Entier 4 bytes
            return parseInt(balanceCbor.slice(2, 10), 16) / 1_000_000;
        } else if (balanceCbor.startsWith('19')) {
            // Entier 2 bytes
            return parseInt(balanceCbor.slice(2, 6), 16) / 1_000_000;
        } else if (balanceCbor.startsWith('18')) {
            // Entier 1 byte
            return parseInt(balanceCbor.slice(2, 4), 16) / 1_000_000;
        } else if (balanceCbor.startsWith('82')) {
            // Tuple [lovelace, assets]
            const lovelacePart = balanceCbor.slice(2);
            if (lovelacePart.startsWith('1b')) {
                return parseInt(lovelacePart.slice(2, 18), 16) / 1_000_000;
            } else if (lovelacePart.startsWith('1a')) {
                return parseInt(lovelacePart.slice(2, 10), 16) / 1_000_000;
            } else if (lovelacePart.startsWith('19')) {
                return parseInt(lovelacePart.slice(2, 6), 16) / 1_000_000;
            } else if (lovelacePart.startsWith('18')) {
                return parseInt(lovelacePart.slice(2, 4), 16) / 1_000_000;
            }
            return parseInt(lovelacePart.slice(0, 2), 16) / 1_000_000;
        }
        // Petit entier direct (0-23)
        return parseInt(balanceCbor.slice(0, 2), 16) / 1_000_000;
    } catch {
        console.warn('Could not parse balance CBOR:', balanceCbor);
        return 0;
    }
}


export function useWallet() {
    const [state, setState] = useState<WalletState>({
        connected: false,
        address: null,
        balance: null,
        network: null,
        walletApi: null,
        walletType: null,
        isLoading: false,
        error: null,
    });

    const [walletChecked, setWalletChecked] = useState(false);
    const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);

    // Check wallet availability on mount
    useEffect(() => {
        const checkWallets = () => {
            const cardano = getCardano();
            const isMobile = isMobileDevice();
            const inEternlBrowser = isInEternlBrowser();
            const eternlWallet = getEternlWallet();

            let wallets: WalletInfo[] = [];

            // Si on est dans le navigateur in-app d'Eternl
            if (inEternlBrowser && eternlWallet) {
                wallets = [{
                    id: 'eternl',
                    name: 'Eternl',
                    icon: '🔷',
                    installed: true,
                    isMobile: false,
                }];
            }
            // Sur mobile (hors navigateur in-app)
            else if (isMobile) {
                wallets = [{
                    id: 'eternl-mobile',
                    name: 'Eternl',
                    icon: '📱',
                    installed: true,
                    isMobile: true,
                    deepLink: 'eternl://',
                    appStoreUrl: 'https://apps.apple.com/app/eternl/id1603854498',
                    playStoreUrl: 'https://play.google.com/store/apps/details?id=io.eternl.app',
                }];
            }
            // Desktop
            else {
                wallets = [
                    {
                        id: 'eternl',
                        name: 'Eternl',
                        icon: '🔷',
                        installed: !!eternlWallet,
                        isMobile: false,
                    },
                    {
                        id: 'lace',
                        name: 'Lace',
                        icon: '💎',
                        installed: !!cardano?.lace,
                        isMobile: false,
                    },
                ];
            }

            setAvailableWallets(wallets);
            setWalletChecked(true);
        };

        // Check immediately and after delays (wallets inject async)
        checkWallets();
        const t1 = setTimeout(checkWallets, 500);
        const t2 = setTimeout(checkWallets, 1500);
        const t3 = setTimeout(checkWallets, 3000);
        
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    // Connect to wallet
    const connect = useCallback(async (walletType?: WalletType) => {
        const cardano = getCardano();
        const isMobile = isMobileDevice();
        
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            let walletApi: WalletApi;
            let selectedWallet: WalletType = walletType || null;

            // Auto-detect wallet if not specified
            if (!selectedWallet) {
                const eternlWallet = getEternlWallet();
                if (eternlWallet) selectedWallet = 'eternl';
                else if (cardano?.lace) selectedWallet = 'lace';
                else if (isMobile) selectedWallet = 'eternl-mobile';
            }

            // Handle Eternl Mobile - open in Eternl's dApp browser
            if (selectedWallet === 'eternl-mobile') {
                return handleEternlMobile();
            }

            // Desktop wallet connection
            switch (selectedWallet) {
                case 'eternl': {
                    const eternlWallet = getEternlWallet();
                    if (!eternlWallet) {
                        throw new Error('Eternl non installé. Installez l\'extension depuis eternl.io');
                    }
                    walletApi = await eternlWallet.enable();
                    break;
                }
                case 'lace': {
                    if (!cardano?.lace) {
                        throw new Error('Lace non installé. Installez l\'extension depuis lace.io');
                    }
                    walletApi = await cardano.lace.enable();
                    break;
                }
                default:
                    throw new Error('Veuillez installer Eternl ou Lace.');
            }

            // Get address
            let addresses = await walletApi.getUsedAddresses();
            if (!addresses || addresses.length === 0) {
                if (walletApi.getUnusedAddresses) {
                    addresses = await walletApi.getUnusedAddresses();
                }
            }
            const address = addresses?.[0] || null;

            if (!address) {
                throw new Error('Aucune adresse trouvée dans le wallet');
            }

            // Get network
            const networkId = await walletApi.getNetworkId();
            const network = networkId === 0 ? 'preprod' : networkId === 1 ? 'mainnet' : 'preview';

            // Get balance
            const balanceCbor = await walletApi.getBalance();
            const balance = parseCborBalance(balanceCbor);

            setState({
                connected: true,
                address,
                balance: balance.toFixed(2),
                network,
                walletApi,
                walletType: selectedWallet,
                isLoading: false,
                error: null,
            });

            localStorage.setItem('walletConnected', 'true');
            localStorage.setItem('walletType', selectedWallet || '');
            return true;

        } catch (error: any) {
            console.error('Wallet connection error:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message || 'Échec de connexion au wallet',
            }));
            return false;
        }
    }, []);


    // Handle Eternl Mobile connection via deep link
    const handleEternlMobile = useCallback(() => {
        const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
        const iOS = isIOSDevice();
        
        // Eternl dApp browser deep link
        // iOS: Universal link qui ouvre l'app ou redirige vers le store
        // Android: Deep link direct
        let deepLink: string;
        
        if (iOS) {
            // iOS Universal Link - ouvre le dApp browser d'Eternl
            deepLink = `https://eternl.io/app?dappUrl=${encodeURIComponent(currentUrl)}`;
        } else {
            // Android Intent - ouvre directement dans Eternl
            deepLink = `intent://browser?url=${encodeURIComponent(currentUrl)}#Intent;scheme=eternl;package=io.eternl.app;end`;
        }
        
        // Sauvegarder l'état pour la reconnexion après retour
        sessionStorage.setItem('eternl_mobile_pending', 'true');
        
        // Ouvrir le deep link
        window.location.href = deepLink;
        
        // Timeout pour détecter si l'app n'est pas installée
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            // Si plus de 3 secondes et toujours sur la page, l'app n'est probablement pas installée
            if (Date.now() - startTime > 3000) {
                clearInterval(checkInterval);
                
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: null,
                }));
                
                // Proposer d'installer l'app
                const storeUrl = iOS
                    ? 'https://apps.apple.com/app/eternl/id1603854498'
                    : 'https://play.google.com/store/apps/details?id=io.eternl.app';
                
                if (confirm('Eternl n\'est pas installé. Voulez-vous l\'installer ?')) {
                    window.open(storeUrl, '_blank');
                }
            }
        }, 500);
        
        // Nettoyer si la page perd le focus (l'app s'est ouverte)
        const cleanup = () => {
            clearInterval(checkInterval);
            setState(prev => ({ ...prev, isLoading: false }));
        };
        
        window.addEventListener('blur', cleanup, { once: true });
        window.addEventListener('pagehide', cleanup, { once: true });
        
        return false;
    }, []);

    // Disconnect wallet
    const disconnect = useCallback(() => {
        setState({
            connected: false,
            address: null,
            balance: null,
            network: null,
            walletApi: null,
            walletType: null,
            isLoading: false,
            error: null,
        });
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('walletType');
        sessionStorage.removeItem('eternl_mobile_pending');
    }, []);

    // Auto-reconnect on mount
    useEffect(() => {
        if (!walletChecked) return;
        
        const wasConnected = localStorage.getItem('walletConnected');
        const savedWalletType = localStorage.getItem('walletType') as WalletType;
        
        // Ne pas auto-reconnecter pour mobile (nécessite interaction utilisateur)
        if (wasConnected && savedWalletType && savedWalletType !== 'eternl-mobile') {
            const wallet = availableWallets.find(w => w.id === savedWalletType);
            if (wallet?.installed) {
                connect(savedWalletType);
            }
        }
        
        // Vérifier si on revient du navigateur Eternl mobile
        const pendingMobile = sessionStorage.getItem('eternl_mobile_pending');
        if (pendingMobile && isInEternlBrowser()) {
            sessionStorage.removeItem('eternl_mobile_pending');
            connect('eternl');
        }
    }, [walletChecked, availableWallets, connect]);

    // Computed values
    const isEternlInstalled = availableWallets.some(w => w.id === 'eternl' && w.installed);
    const isLaceInstalled = availableWallets.some(w => w.id === 'lace' && w.installed);

    return {
        ...state,
        connect,
        disconnect,
        availableWallets,
        isEternlInstalled,
        isLaceInstalled,
        isMobile: isMobileDevice(),
        isInEternlBrowser: isInEternlBrowser(),
    };
}
