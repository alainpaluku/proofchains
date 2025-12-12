/**
 * PROOFCHAIN - Wallet Connection Hook
 * Manage Nami/Lace/Eternal wallet connection state
 * Supports desktop extensions and mobile via WalletConnect
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

export type WalletType = 'nami' | 'lace' | 'eternl' | 'eternl-mobile' | null;

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
            
            const wallets: WalletInfo[] = [
                {
                    id: 'eternl',
                    name: 'Eternl',
                    icon: '🔷',
                    installed: !!cardano?.eternl,
                    isMobile: false,
                },
                {
                    id: 'eternl-mobile',
                    name: 'Eternl Mobile',
                    icon: '📱',
                    installed: true, // Always available via deep link
                    isMobile: true,
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
            ];

            // Filter based on device type
            const filteredWallets = isMobile 
                ? wallets.filter(w => w.isMobile || w.installed)
                : wallets.filter(w => !w.isMobile || w.installed);

            setAvailableWallets(filteredWallets);
            setWalletChecked(true);
        };

        // Check immediately and after a delay (wallets inject async)
        checkWallets();
        const timeout = setTimeout(checkWallets, 1000);
        return () => clearTimeout(timeout);
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
                const encodedUrl = encodeURIComponent(currentUrl);
                
                // Open Eternl mobile app with dApp connector
                const deepLink = `eternl://dapp?url=${encodedUrl}`;
                
                // For iOS, try universal link first
                const universalLink = `https://eternl.io/app?url=${encodedUrl}`;
                
                if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                    window.location.href = universalLink;
                } else {
                    window.location.href = deepLink;
                }
                
                // Set a timeout to check if app opened
                setTimeout(() => {
                    setState(prev => ({
                        ...prev,
                        isLoading: false,
                        error: 'Si Eternl ne s\'est pas ouvert, veuillez installer l\'application.',
                    }));
                }, 3000);
                
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
