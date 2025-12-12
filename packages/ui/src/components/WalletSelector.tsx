'use client';

import React, { useState } from 'react';
import { X, ExternalLink, Smartphone, Monitor } from 'lucide-react';
import { useWallet, WalletType, WalletInfo } from '../hooks/useWallet';
import { WalletIconMap } from '../assets/WalletIcons';

interface WalletSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onConnect: (walletType: WalletType) => void;
}

const WalletLinks: Record<string, string> = {
    eternl: 'https://eternl.io/',
    lace: 'https://www.lace.io/',
    nami: 'https://namiwallet.io/',
    'eternl-mobile': 'https://eternl.io/app',
};

export function WalletSelector({ isOpen, onClose, onConnect }: WalletSelectorProps) {
    const { availableWallets, isLoading, isMobile } = useWallet();
    const [selectedTab, setSelectedTab] = useState<'desktop' | 'mobile'>(isMobile ? 'mobile' : 'desktop');

    if (!isOpen) return null;

    const desktopWallets = availableWallets.filter(w => !w.isMobile);
    const mobileWallets = availableWallets.filter(w => w.isMobile);

    const handleWalletClick = (wallet: WalletInfo) => {
        if (wallet.installed || wallet.isMobile) {
            onConnect(wallet.id);
        } else {
            window.open(WalletLinks[wallet.id || ''], '_blank');
        }
    };

    const WalletButton = ({ wallet }: { wallet: WalletInfo }) => {
        const IconComponent = WalletIconMap[wallet.id || ''];
        const isAvailable = wallet.installed || wallet.isMobile;

        return (
            <button
                onClick={() => handleWalletClick(wallet)}
                disabled={isLoading}
                className={`
                    w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                    ${isAvailable 
                        ? 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer' 
                        : 'border-gray-100 dark:border-gray-800 opacity-60 cursor-pointer hover:opacity-80'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                `}
            >
                {IconComponent && <IconComponent className="w-10 h-10 flex-shrink-0" />}
                <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        {wallet.name}
                        {wallet.isMobile && <Smartphone className="w-4 h-4 text-blue-500" />}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {isAvailable 
                            ? (wallet.isMobile ? 'Ouvrir l\'application' : 'Cliquer pour connecter')
                            : 'Cliquer pour installer'
                        }
                    </div>
                </div>
                {!isAvailable && (
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                )}
                {isAvailable && !wallet.isMobile && (
                    <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                        Installé
                    </div>
                )}
            </button>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Connecter un portefeuille
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setSelectedTab('desktop')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors
                            ${selectedTab === 'desktop' 
                                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <Monitor className="w-4 h-4" />
                        Extension
                    </button>
                    <button
                        onClick={() => setSelectedTab('mobile')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors
                            ${selectedTab === 'mobile' 
                                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <Smartphone className="w-4 h-4" />
                        Mobile
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
                    {selectedTab === 'desktop' ? (
                        <>
                            {desktopWallets.length > 0 ? (
                                desktopWallets.map(wallet => (
                                    <WalletButton key={wallet.id} wallet={wallet} />
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    Aucun portefeuille détecté
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {mobileWallets.map(wallet => (
                                <WalletButton key={wallet.id} wallet={wallet} />
                            ))}
                            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    <strong>Eternl Mobile</strong> vous permet de connecter votre portefeuille 
                                    depuis votre téléphone. L'application s'ouvrira automatiquement.
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        En connectant votre portefeuille, vous acceptez nos conditions d'utilisation
                    </p>
                </div>
            </div>
        </div>
    );
}
