'use client';

import React, { useState } from 'react';
import { Wallet, LogOut, ChevronDown } from 'lucide-react';
import { useWallet, WalletType } from '../hooks/useWallet';
import { WalletSelector } from './WalletSelector';

interface ConnectWalletButtonProps {
    className?: string;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    showBalance?: boolean;
}

// Wallet type display names
const walletNames: Record<string, string> = {
    eternl: 'Eternl',
    'eternl-mobile': 'Eternl',
    lace: 'Lace',
    'lace-mobile': 'Lace',
    nami: 'Nami',
};

export function ConnectWalletButton({
    className = '',
    variant = 'primary',
    size = 'md',
    showBalance = true,
}: ConnectWalletButtonProps) {
    const { 
        connected, 
        address, 
        balance, 
        walletType,
        connect, 
        disconnect, 
        isLoading, 
        error,
        availableWallets,
    } = useWallet();
    
    const [mounted, setMounted] = useState(false);
    const [showSelector, setShowSelector] = useState(false);

    React.useEffect(() => { setMounted(true); }, []);

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const variantClasses = {
        primary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white',
        secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
        outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20',
    };

    const handleConnect = () => {
        setShowSelector(true);
    };

    const handleWalletSelect = async (walletType: WalletType) => {
        setShowSelector(false);
        await connect(walletType);
    };

    if (!mounted) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <button disabled className={`flex items-center gap-2 rounded-lg font-medium transition-all ${sizeClasses[size]} ${variantClasses[variant]} opacity-50`}>
                    <Wallet className="w-4 h-4" />
                    Connecter le portefeuille
                </button>
            </div>
        );
    }

    // Check if any wallet is available
    const hasAvailableWallet = availableWallets.some(w => w.installed || w.isMobile);

    if (!hasAvailableWallet) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <button 
                    onClick={handleConnect}
                    className={`flex items-center gap-2 rounded-lg font-medium transition-all ${sizeClasses[size]} ${variantClasses[variant]}`}
                >
                    <Wallet className="w-4 h-4" />
                    Installer un portefeuille
                </button>
                <WalletSelector 
                    isOpen={showSelector} 
                    onClose={() => setShowSelector(false)}
                    onConnect={handleWalletSelect}
                />
            </div>
        );
    }

    return (
        <>
            <div className={`flex items-center gap-2 ${className}`}>
                {connected && showBalance && balance && (
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{balance} ₳</span>
                    </div>
                )}

                {connected ? (
                    <div className="flex items-center gap-1">
                        {/* Wallet info badge */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-l-lg border-r border-green-200 dark:border-green-800">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                {walletType ? walletNames[walletType] : 'Connecté'}
                            </span>
                        </div>
                        
                        {/* Disconnect button */}
                        <button 
                            onClick={disconnect} 
                            disabled={isLoading} 
                            className={`flex items-center gap-2 rounded-lg sm:rounded-l-none font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} bg-red-500 hover:bg-red-600 text-white`}
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Déconnecter</span>
                            <span className="sm:hidden">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={handleConnect} 
                        disabled={isLoading} 
                        className={`flex items-center gap-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]}`}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Connexion...
                            </>
                        ) : (
                            <>
                                <Wallet className="w-4 h-4" />
                                Connecter
                                <ChevronDown className="w-4 h-4" />
                            </>
                        )}
                    </button>
                )}
            </div>

            {error && (
                <div className="fixed bottom-4 right-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400 max-w-xs shadow-lg z-50">
                    {error}
                </div>
            )}

            <WalletSelector 
                isOpen={showSelector} 
                onClose={() => setShowSelector(false)}
                onConnect={handleWalletSelect}
            />
        </>
    );
}
