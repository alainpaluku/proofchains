/**
 * PROOFCHAIN - Wallet Connection Hook
 * Manage Nami/Lace/Eternal wallet connection state
 * Supports desktop extensions and mobile via deep links
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

interface WalletApi {
    getUsedAddresses: () => Promise<string[]>;
    getNetworkId: () => Promise<number>;
    getBalance: () => Promise<string>;
    signTx: (tx: string, partialSign?: boolean) => Promise<string>;
    submitTx: (tx: string) => Promise<string>;
}

export type WalletType = 'nami' | 'lace' | 'eternl' | 'eternl-mobile' | 'vespr' | 'flint' | null;

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
function isIOS() {
    if (typeof window === 'undefined') return false;
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Check if Android
function isAndroid() {
    if (typeof window === 'undefined') return false;
    return /Android/i.test(navigator.userAgent);
}

// Check if in-app browser (wallet browser)
function isInAppBrowser() {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes('eternl') || ua.includes('vespr') || ua.includes('flint') || ua.includes('wv');
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
            const inAppBrowser = isInAppBrowser();
            
            // Desktop wallets
            const desktopWallets: WalletInfo[] = [
                {
                    id: 'eternl',
                    name: 'Eternl',
                    icon: '🔷',
                    installed: !!cardano?.eternl,
                    isMobile: false,
                },
                {
                    id: 'lace',
                    name: 'Lace',
                    icon: '💎',
                    installed: !!cardano?.lace,
                    isMobile: false,
                },
                {
                    id: 'nami',
                    name: 'Nami',
                    icon: '🦊',
                    installed: !!cardano?.nami,
                    isMobile: false,
                },
                {
                    id: 'flint',
                    name: 'Flint',
                    icon: '🔥',
                    installed: !!cardano?.flint,
                    isMobile: false,
                },
            ];

            // Mobile wallets with deep links
            const mobileWallets: WalletInfo[] = [
                {
                    id: 'eternl-mobile',
                    name: 'Eternl',
                    icon: '📱',
                    installed: true,
                    isMobile: true,
                    deepLink: 'eternl://',
                    appStoreUrl: 'https://apps.apple.com/app/eternl/id1603854498',
                    playStoreUrl: 'https://play.google.com/store/apps/details?id=io.eternl.app',
                },
                {
                    id: 'vespr',
                    name: 'VESPR',
                    icon: '🌟',
                    installed: true,
                    isMobile: true,
                    deepLink: 'vespr://',
                    appStoreUrl: 'https://apps.apple.com/app/vespr-wallet/id1565749376',
                    playStoreUrl: 'https://play.google.com/store/apps/details?id=art.nft_craze.gallery.main',
                },
            ];

            let wallets: WalletInfo[];

            // If in wallet's in-app browser, check for injected wallet
            if (inAppBrowser && cardano) {
                wallets = desktopWallets.filter(w => w.installed);
                if (wallets.length === 0) {
                    // Fallback: try to detect any cardano wallet
                    const walletKeys = Object.keys(cardano).filter(k => 
                        typeof cardano[k]?.enable === 'function'
                    );
                    if (walletKeys.length > 0) {
                        wallets = [{
                            id: walletKeys[0] as WalletType,
                            name: walletKeys[0].charAt(0).toUpperCase() + walletKeys[0].slice(1),
                            icon: '💳',
                            installed: true,
                            isMobile: false,
                        }];
                    }
                }
            } else if (isMobile) {
                // On mobile browser, show mobile wallet options
                wallets = mobileWallets;
            } else {
                // Desktop: show desktop wallets
                wallets = desktopWallets;
            }

            setAvailableWallets(wallets);
            setWalletChecked(true);
        };

        // Check immediately and after a delay (wallets inject async)
        checkWallets();
        const timeout = setTimeout(checkWallets, 1000);
        // Also check after longer delay for slow wallet injections
        const timeout2 = setTimeout(checkWallets, 2500);
        return () => {
            clearTimeout(timeout);
            clearTimeout(timeout2);
        };
    }, []);

    // Connect to specific wallet
    const connect = useCallback(async (walletType?: WalletType) => {
        const cardano = getCardano();
        const isMobile = isMobileDevice();
        
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            let walletApi: WalletApi;
            let selectedWallet: WalletType = walletType || null;

            // If no wallet type specified, try to auto-detect
            if (!selectedWallet) {
                if (cardano?.eternl) selectedWallet = 'eternl';
                else if (cardano?.lace) selectedWallet = 'lace';
                else if (cardano?.nami) selectedWallet = 'nami';
                else if (isMobile) selectedWallet = 'eternl-mobile';
            }

            // Handle Eternl Mobile via deep link
            if (selectedWallet === 'eternl-mobile') {
                const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
                
                // Eternl mobile deep link format: ouvre le dApp browser avec l'URL
                // Format: eternl://wc?uri=<url> ou eternl://browser?url=<url>
                const isIOSDevice = /iPhone|iPad|iPod/i.test(navigator.userAgent);
                
                // Essayer plusieurs formats de deep link
                let deepLink: string;
                
                if (isIOSDevice) {
                    // iOS: utiliser le universal link d'Eternl
                    deepLink = `https://eternl.io/app/browser?url=${encodeURIComponent(currentUrl)}`;
                } else {
                    // Android: utiliser le deep link direct
                    deepLink = `eternl://browser?url=${encodeURIComponent(currentUrl)}`;
                }
                
                // Ouvrir le deep link
                window.location.href = deepLink;
                
                // Fallback: si l'app ne s'ouvre pas après 2.5s, proposer d'installer
                const timeout = setTimeout(() => {
                    // Vérifier si on est toujours sur la même page (l'app ne s'est pas ouverte)
                    setState(prev => ({
                        ...prev,
                        isLoading: false,
                        error: null,
                    }));
                    
                    // Proposer d'ouvrir le store
                    const storeUrl = isIOSDevice 
                        ? 'https://apps.apple.com/app/eternl/id1603854498'
                        : 'https://play.google.com/store/apps/details?id=io.eternl.app';
                    
                    if (confirm('Eternl ne s\'est pas ouvert. Voulez-vous l\'installer ?')) {
                        window.open(storeUrl, '_blank');
                    }
                }, 2500);
                
                // Nettoyer le timeout si la page change
                window.addEventListener('blur', () => clearTimeout(timeout), { once: true });
                
                return false;
            }

            // Desktop wallet connection
            switch (selectedWallet) {
                case 'eternl':
                    if (!cardano?.eternl) throw new Error('Eternl wallet not installed');
                    walletApi = await cardano.eternl.enable();
                    break;
                case 'lace':
                    if (!cardano?.lace) throw new Error('Lace wallet not installed');
                    walletApi = await cardano.lace.enable();
                    break;
                case 'nami':
                    if (!cardano?.nami) throw new Error('Nami wallet not installed');
                    walletApi = await cardano.nami.enable();
                    break;
                default:
                    throw new Error('No compatible wallet found. Please install Eternl, Lace or Nami.');
            }

            const addressHex = await walletApi.getUsedAddresses();
            const address = addressHex[0];

            const networkId = await walletApi.getNetworkId();
            const network = networkId === 0 ? 'preprod' : networkId === 1 ? 'mainnet' : 'preview';

            const balanceHex = await walletApi.getBalance();
            const balance = parseInt(balanceHex, 16) / 1_000_000;

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
                error: error.message || 'Failed to connect wallet',
            }));
            return false;
        }
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
    }, []);

    // Auto-reconnect
    useEffect(() => {
        if (!walletChecked) return;
        
        const wasConnected = localStorage.getItem('walletConnected');
        const savedWalletType = localStorage.getItem('walletType') as WalletType;
        
        if (wasConnected && savedWalletType && savedWalletType !== 'eternl-mobile') {
            const wallet = availableWallets.find(w => w.id === savedWalletType);
            if (wallet?.installed) {
                connect(savedWalletType);
            }
        }
    }, [walletChecked, availableWallets, connect]);

    // Legacy compatibility
    const isLaceInstalled = availableWallets.some(w => w.id === 'lace' && w.installed);
    const isNamiInstalled = availableWallets.some(w => w.id === 'nami' && w.installed);
    const isEternlInstalled = availableWallets.some(w => w.id === 'eternl' && w.installed);

    return {
        ...state,
        connect,
        disconnect,
        availableWallets,
        isLaceInstalled,
        isNamiInstalled,
        isEternlInstalled,
        isMobile: isMobileDevice(),
    };
}
