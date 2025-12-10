/**
 * PROOFCHAIN - Wallet Connection Hook
 * Manage Nami wallet connection state
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

interface CardanoWallet {
    enable: () => Promise<WalletApi>;
}

interface CardanoWindow {
    lace?: CardanoWallet;
    nami?: CardanoWallet;
}

interface WalletApi {
    getUsedAddresses: () => Promise<string[]>;
    getNetworkId: () => Promise<number>;
    getBalance: () => Promise<string>;
    signTx: (tx: string, partialSign?: boolean) => Promise<string>;
    submitTx: (tx: string) => Promise<string>;
}

export interface WalletState {
    connected: boolean;
    address: string | null;
    balance: string | null;
    network: 'mainnet' | 'preprod' | 'preview' | null;
    walletApi: any | null;
    isLoading: boolean;
    error: string | null;
}

export function useWallet() {
    const [state, setState] = useState<WalletState>({
        connected: false,
        address: null,
        balance: null,
        network: null,
        walletApi: null,
        isLoading: false,
        error: null,
    });

    // Get cardano object from window
    const getCardano = useCallback((): CardanoWindow | undefined => {
        if (typeof window !== 'undefined') {
            return (window as unknown as { cardano?: CardanoWindow }).cardano;
        }
        return undefined;
    }, []);

    // Check if Lace is installed
    const isLaceInstalled = useCallback(() => {
        return !!getCardano()?.lace;
    }, [getCardano]);

    // Check if Nami is installed
    const isNamiInstalled = useCallback(() => {
        return !!getCardano()?.nami;
    }, [getCardano]);

    // Connect to wallet (Lace preferred, then Nami)
    const connect = useCallback(async () => {
        const laceAvailable = isLaceInstalled();
        const namiAvailable = isNamiInstalled();

        if (!laceAvailable && !namiAvailable) {
            setState(prev => ({
                ...prev,
                error: 'No compatible wallet found. Please install Lace (lace.io) or Nami (namiwallet.io)',
            }));
            return false;
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            let walletApi;
            const cardano = getCardano();

            // Prefer Lace if available
            if (laceAvailable && cardano?.lace) {
                walletApi = await cardano.lace.enable();
            } else if (namiAvailable && cardano?.nami) {
                walletApi = await cardano.nami.enable();
            } else {
                throw new Error('No wallet available');
            }

            // Get wallet address
            const addressHex = await walletApi.getUsedAddresses();
            const address = addressHex[0];

            // Get network ID
            const networkId = await walletApi.getNetworkId();
            const network = networkId === 0 ? 'preprod' : networkId === 1 ? 'mainnet' : 'preview';

            // Get balance
            const balanceHex = await walletApi.getBalance();
            const balance = parseInt(balanceHex, 16) / 1_000_000; // Convert lovelace to ADA

            setState({
                connected: true,
                address,
                balance: balance.toFixed(2),
                network,
                walletApi,
                isLoading: false,
                error: null,
            });

            // Store connection in localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('walletConnected', 'true');
            }

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
    }, [isLaceInstalled, isNamiInstalled]);

    // Disconnect wallet
    const disconnect = useCallback(() => {
        setState({
            connected: false,
            address: null,
            balance: null,
            network: null,
            walletApi: null,
            isLoading: false,
            error: null,
        });

        if (typeof window !== 'undefined') {
            localStorage.removeItem('walletConnected');
        }
    }, []);

    // Auto-reconnect on mount if previously connected
    useEffect(() => {
        const wasConnected = typeof window !== 'undefined' && localStorage.getItem('walletConnected');
        if (wasConnected) {
            if (isLaceInstalled() || isNamiInstalled()) {
                connect();
            }
        }
    }, [connect, isLaceInstalled, isNamiInstalled]);

    return {
        ...state,
        connect,
        disconnect,
        isLaceInstalled: isLaceInstalled(),
        isNamiInstalled: isNamiInstalled(),
    };
}
