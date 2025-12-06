'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, QrCode, Camera, Upload, Scan, FileSearch } from 'lucide-react';
import { useI18n } from '@proofchain/ui';

export default function ScanPage() {
    const router = useRouter();
    const { t } = useI18n();
    const [manualInput, setManualInput] = useState('');

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualInput.trim()) {
            router.push(`/verify/${encodeURIComponent(manualInput.trim())}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 min-w-[44px] min-h-[44px] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                            aria-label="Retour"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Scan className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                {t('scan.title')}
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {t('scan.subtitle')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Scanner Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8">
                        {/* Scanner Placeholder */}
                        <div className="relative aspect-square max-w-md mx-auto mb-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 dark:from-purple-600/10 dark:to-blue-600/10 rounded-2xl" />
                            <div className="relative h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl bg-white/50 dark:bg-gray-800/50">
                                <Camera className="w-24 h-24 text-gray-400 dark:text-gray-500" />
                                <div className="text-center space-y-1">
                                    <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">
                                        Scanner QR Code
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500 max-w-xs">
                                        Fonctionnalité en développement
                                    </p>
                                </div>
                            </div>

                            {/* Corner Decorations */}
                            <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-purple-600 rounded-tl-lg" />
                            <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-purple-600 rounded-tr-lg" />
                            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-purple-600 rounded-bl-lg" />
                            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-purple-600 rounded-br-lg" />
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                            <button
                                disabled
                                className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-xl font-medium cursor-not-allowed"
                            >
                                <Camera className="w-5 h-5" />
                                Caméra
                            </button>
                            <button
                                disabled
                                className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-xl font-medium cursor-not-allowed"
                            >
                                <Upload className="w-5 h-5" />
                                Importer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-4 bg-gray-50 dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-400 font-medium">
                            OU
                        </span>
                    </div>
                </div>

                {/* Manual Input */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <FileSearch className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('scan.manualTitle')}
                        </h2>
                    </div>

                    <form onSubmit={handleManualSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={manualInput}
                            onChange={(e) => setManualInput(e.target.value)}
                            placeholder={t('scan.manualPlaceholder')}
                            className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-purple-600 dark:focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition-all"
                        />

                        <button
                            type="submit"
                            disabled={!manualInput.trim()}
                            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <QrCode className="w-5 h-5" />
                            {t('scan.verifyButton')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
