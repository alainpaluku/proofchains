/**
 * PROOFCHAIN - Wallet Connection Hook
 * Supports Eternl and Lace wallets (desktop + mobile)
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface WalletApi {
    getUsedAddresses: () => Promise<string[]>;
    getUnusedAddresses?: () => Promise<string[]>;
    getNetworkId: () => Promise<number>;
    getBalance: () => Promise<string>;
    signTx: (tx: string, partialSign?: boolean) => Promise<string>;
    submitTx: (tx: string) => Promise<string>;
}

export type WalletType = 'eternl' | 'eternl-mobile' | 'lace' | 'lace-mobile' | null;

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

// Helper to get cardano from window with retry
function getCardano(): any {
    if (typeof window === 'undefined') return undefined;
    return (window as any).cardano;
}

// Check if running on mobile
function isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Check if iOS
function isIOSDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Check if Android
function isAndroidDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return /Android/i.test(navigator.userAgent);
}

// Check if in Eternl's in-app browser
function isInEternlBrowser(): boolean {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent.toLowerCase();
    const cardano = getCardano();
    // Eternl injecte son wallet dans le navigateur in-app
    return ua.includes('eternl') || (isMobileDevice() && cardano?.eternl && !cardano?.lace);
}

// Check if in Lace's in-app browser (if they have one)
function isInLaceBrowser(): boolean {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent.toLowerCase();
    const cardano = getCardano();
    return ua.includes('lace') || (isMobileDevice() && cardano?.lace && !cardano?.eternl);
}

// Helper to detect Eternl wallet (handles different property names)
function getEternlWallet(): any {
    const cardano = getCardano();
    if (!cardano) return null;
    // Eternl peut être injecté sous 'eternl' ou 'ccvault' (ancien nom)
    return cardano.eternl || cardano.ccvault || null;
}

// Helper to detect Lace wallet
function getLaceWallet(): any {
    const cardano = getCardano();
    if (!cardano) return null;
    return cardano.lace || null;
}

// Wait for wallet to be injected (some wallets inject async)
async function waitForWallet(walletName: 'eternl' | 'lace', maxWait = 3000): Promise<any> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWait) {
        const cardano = getCardano();
        if (walletName === 'eternl') {
            const wallet = cardano?.eternl || cardano?.ccvault;
            if (wallet) return wallet;
        } else if (walletName === 'lace') {
            if (cardano?.lace) return cardano.lace;
        }
        await new Promise(r => setTimeout(r, 100));
    }
    return null;
}

// Parse CBOR balance to ADA
function parseCborBalance(balanceCbor: string): number {
    try {
        if (!balanceCbor || typeof balanceCbor !== 'string') return 0;
        
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
        const val = parseInt(balanceCbor.slice(0, 2), 16);
        return isNaN(val) ? 0 : val / 1_000_000;
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
    const connectionAttemptRef = useRef(0);

    // Check wallet availability on mount
    useEffect(() => {
        const checkWallets = () => {
            const isMobile = isMobileDevice();
            const inEternlBrowser = isInEternlBrowser();
            const inLaceBrowser = isInLaceBrowser();
            const eternlWallet = getEternlWallet();
            const laceWallet = getLaceWallet();

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
            // Si on est dans le navigateur in-app de Lace
            else if (inLaceBrowser && laceWallet) {
                wallets = [{
                    id: 'lace',
                    name: 'Lace',
                    icon: '💎',
                    installed: true,
                    isMobile: false,
                }];
            }
            // Sur mobile (hors navigateur in-app)
            else if (isMobile) {
                wallets = [
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
                        id: 'lace-mobile',
                        name: 'Lace',
                        icon: '💎',
                        installed: true,
                        isMobile: true,
                        deepLink: 'lace://',
                        appStoreUrl: 'https://apps.apple.com/app/lace-cardano-wallet/id6450aborting',
                        playStoreUrl: 'https://play.google.com/store/apps/details?id=io.lace.app',
                    },
                ];
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
                        installed: !!laceWallet,
                        isMobile: false,
                    },
                ];
            }

            setAvailableWallets(wallets);
            setWalletChecked(true);
        };

        // Check immediately and after delays (wallets inject async)
        checkWallets();
        const t1 = setTimeout(checkWallets, 300);
        const t2 = setTimeout(checkWallets, 800);
        const t3 = setTimeout(checkWallets, 1500);
        const t4 = setTimeout(checkWallets, 3000);
        
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, []);

    // Connect to wallet
    const connect = useCallback(async (walletType?: WalletType) => {
        const isMobile = isMobileDevice();
        const attemptId = ++connectionAttemptRef.current;
        
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            let walletApi: WalletApi;
            let selectedWallet: WalletType = walletType || null;

            // Auto-detect wallet if not specified
            if (!selectedWallet) {
                const eternlWallet = getEternlWallet();
                const laceWallet = getLaceWallet();
                if (eternlWallet) selectedWallet = 'eternl';
                else if (laceWallet) selectedWallet = 'lace';
                else if (isMobile) selectedWallet = 'eternl-mobile';
            }

            // Handle Mobile wallets - open in dApp browser
            if (selectedWallet === 'eternl-mobile') {
                return handleMobileWallet('eternl');
            }
            if (selectedWallet === 'lace-mobile') {
                return handleMobileWallet('lace');
            }

            // Desktop wallet connection with retry
            switch (selectedWallet) {
                case 'eternl': {
                    let eternlWallet = getEternlWallet();
                    
                    // Wait for wallet injection if not found immediately
                    if (!eternlWallet) {
                        eternlWallet = await waitForWallet('eternl', 2000);
                    }
                    
                    if (!eternlWallet) {
                        throw new Error('Eternl non détecté. Veuillez installer l\'extension depuis eternl.io et rafraîchir la page.');
                    }
                    
                    try {
                        walletApi = await eternlWallet.enable();
                    } catch (enableError: any) {
                        // Handle user rejection
                        if (enableError.code === -3 || enableError.message?.includes('rejected') || enableError.message?.includes('cancelled')) {
                            throw new Error('Connexion refusée par l\'utilisateur');
                        }
                        throw new Error(`Erreur Eternl: ${enableError.message || 'Connexion échouée'}`);
                    }
                    break;
                }
                case 'lace': {
                    let laceWallet = getLaceWallet();
                    
                    // Wait for wallet injection if not found immediately
                    if (!laceWallet) {
                        laceWallet = await waitForWallet('lace', 2000);
                    }
                    
                    if (!laceWallet) {
                        throw new Error('Lace non détecté. Veuillez installer l\'extension depuis lace.io et rafraîchir la page.');
                    }
                    
                    try {
                        walletApi = await laceWallet.enable();
                    } catch (enableError: any) {
                        // Handle user rejection
                        if (enableError.code === -3 || enableError.message?.includes('rejected') || enableError.message?.includes('cancelled')) {
                            throw new Error('Connexion refusée par l\'utilisateur');
                        }
                        throw new Error(`Erreur Lace: ${enableError.message || 'Connexion échouée'}`);
                    }
                    break;
                }
                default:
                    throw new Error('Veuillez installer Eternl ou Lace pour continuer.');
            }

            // Check if this connection attempt is still valid
            if (attemptId !== connectionAttemptRef.current) {
                return false;
            }

            // Get address with fallback
            let addresses: string[] = [];
            try {
                addresses = await walletApi.getUsedAddresses();
                if ((!addresses || addresses.length === 0) && walletApi.getUnusedAddresses) {
                    addresses = await walletApi.getUnusedAddresses();
                }
            } catch (addrError) {
                console.warn('Error getting addresses:', addrError);
            }
            
            const address = addresses?.[0] || null;

            if (!address) {
                throw new Error('Aucune adresse trouvée. Veuillez créer un compte dans votre wallet.');
            }

            // Get network
            let network: 'mainnet' | 'preprod' | 'preview' = 'preprod';
            try {
                const networkId = await walletApi.getNetworkId();
                network = networkId === 0 ? 'preprod' : networkId === 1 ? 'mainnet' : 'preview';
            } catch (netError) {
                console.warn('Error getting network:', netError);
            }

            // Vérifier que le réseau correspond à la configuration
            const expectedNetwork = process.env.NEXT_PUBLIC_BLOCKFROST_NETWORK || 'preprod';
            if (network !== expectedNetwork && expectedNetwork !== 'mainnet') {
                console.warn(`⚠️ Réseau wallet (${network}) différent du réseau configuré (${expectedNetwork})`);
            }

            // Get balance with error handling
            let balance = 0;
            try {
                const balanceCbor = await walletApi.getBalance();
                balance = parseCborBalance(balanceCbor);
            } catch (balError) {
                console.warn('Error getting balance:', balError);
            }

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
            
            // Only update state if this is still the current attempt
            if (attemptId === connectionAttemptRef.current) {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: error.message || 'Échec de connexion au wallet',
                }));
            }
            return false;
        }
    }, []);


    // Handle Mobile wallet connection via deep link
    const handleMobileWallet = useCallback((walletName: 'eternl' | 'lace') => {
        const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
        const iOS = isIOSDevice();
        const android = isAndroidDevice();
        
        let deepLink: string;
        let storeUrl: string;
        
        if (walletName === 'eternl') {
            if (iOS) {
                // iOS: Universal link qui ouvre le dApp browser d'Eternl
                deepLink = `https://eternl.io/app?dappUrl=${encodeURIComponent(currentUrl)}`;
                storeUrl = 'https://apps.apple.com/app/eternl/id1603854498';
            } else if (android) {
                // Android: Deep link avec fallback vers le store
                // Format plus compatible que intent://
                deepLink = `eternl://dapp?url=${encodeURIComponent(currentUrl)}`;
                storeUrl = 'https://play.google.com/store/apps/details?id=io.eternl.app';
            } else {
                deepLink = `https://eternl.io/app?dappUrl=${encodeURIComponent(currentUrl)}`;
                storeUrl = 'https://eternl.io/';
            }
        } else {
            // Lace mobile
            if (iOS) {
                deepLink = `https://www.lace.io/dapp?url=${encodeURIComponent(currentUrl)}`;
                storeUrl = 'https://apps.apple.com/app/lace-cardano-wallet/id6450372176';
            } else if (android) {
                deepLink = `lace://dapp?url=${encodeURIComponent(currentUrl)}`;
                storeUrl = 'https://play.google.com/store/apps/details?id=io.lace.app';
            } else {
                deepLink = `https://www.lace.io/dapp?url=${encodeURIComponent(currentUrl)}`;
                storeUrl = 'https://www.lace.io/';
            }
        }
        
        // Sauvegarder l'état pour la reconnexion après retour
        sessionStorage.setItem(`${walletName}_mobile_pending`, 'true');
        
        // Pour Android, utiliser une approche plus fiable
        if (android) {
            // Créer un iframe invisible pour tester le deep link
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            const startTime = Date.now();
            
            // Essayer d'ouvrir le deep link
            window.location.href = deepLink;
            
            // Vérifier après un délai si l'app s'est ouverte
            setTimeout(() => {
                document.body.removeChild(iframe);
                
                // Si on est toujours sur la page après 2.5s, l'app n'est probablement pas installée
                if (Date.now() - startTime < 3000 && document.hasFocus()) {
                    setState(prev => ({ ...prev, isLoading: false }));
                    
                    const walletDisplayName = walletName === 'eternl' ? 'Eternl' : 'Lace';
                    if (confirm(`${walletDisplayName} n'est pas installé. Voulez-vous l'installer depuis le Play Store ?`)) {
                        window.open(storeUrl, '_blank');
                    }
                }
            }, 2500);
        } else {
            // iOS et autres: ouvrir directement
            window.location.href = deepLink;
            
            // Timeout pour détecter si l'app n'est pas installée
            const startTime = Date.now();
            const checkInterval = setInterval(() => {
                if (Date.now() - startTime > 3000) {
                    clearInterval(checkInterval);
                    
                    setState(prev => ({ ...prev, isLoading: false }));
                    
                    const walletDisplayName = walletName === 'eternl' ? 'Eternl' : 'Lace';
                    if (confirm(`${walletDisplayName} n'est pas installé. Voulez-vous l'installer ?`)) {
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
        }
        
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
        if (wasConnected && savedWalletType && savedWalletType !== 'eternl-mobile' && savedWalletType !== 'lace-mobile') {
            const wallet = availableWallets.find(w => w.id === savedWalletType);
            if (wallet?.installed) {
                // Petit délai pour laisser le wallet s'initialiser
                setTimeout(() => connect(savedWalletType), 500);
            }
        }
        
        // Vérifier si on revient du navigateur Eternl mobile
        const pendingEternlMobile = sessionStorage.getItem('eternl_mobile_pending');
        if (pendingEternlMobile && isInEternlBrowser()) {
            sessionStorage.removeItem('eternl_mobile_pending');
            setTimeout(() => connect('eternl'), 300);
        }
        
        // Vérifier si on revient du navigateur Lace mobile
        const pendingLaceMobile = sessionStorage.getItem('lace_mobile_pending');
        if (pendingLaceMobile && isInLaceBrowser()) {
            sessionStorage.removeItem('lace_mobile_pending');
            setTimeout(() => connect('lace'), 300);
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
        isInLaceBrowser: isInLaceBrowser(),
    };
}
