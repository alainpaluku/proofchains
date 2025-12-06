/**
 * PROOFCHAIN Verifier - Home Page
 * Redesigned with modern UI
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Search, QrCode, Shield, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { InstitutionCard, useI18n } from '@proofchain/ui';
import { getRecentMints, type VerificationResult } from '@proofchain/chain';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const { t } = useI18n();
    const router = useRouter();
    const [recentVerifications, setRecentVerifications] = useState<VerificationResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadRecentVerifications();
    }, []);

    async function loadRecentVerifications() {
        setIsLoading(true);
        try {
            const policyId = process.env.NEXT_PUBLIC_DEMO_POLICY_ID || '';
            if (policyId) {
                const results = await getRecentMints(policyId, 5);
                setRecentVerifications(results.filter(r => r.valid));
            }
        } catch (error) {
            console.error('Error loading recent verifications:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/verify/${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="min-h-full">
            {/* Hero Section */}
            <section className="relative px-4 py-16 md:py-24 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-white dark:from-purple-950/20 dark:via-blue-950/20 dark:to-gray-900 pointer-events-none" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/30 dark:bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/30 dark:bg-blue-600/10 rounded-full blur-3xl" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200 dark:border-purple-800 shadow-lg">
                            <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
                                {t('verifier.hero.badge')}
                            </span>
                        </div>

                        {/* Title */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {t('verifier.hero.title')}
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                                {t('verifier.hero.subtitle')}
                            </p>
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition duration-300" />
                                <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
                                    <Search className="absolute left-5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={t('verifier.hero.searchPlaceholder')}
                                        className="w-full pl-14 pr-4 py-5 text-base bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 rounded-2xl"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all shadow-lg"
                                    >
                                        {t('action.verify')}
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* CTA Button */}
                        <div className="pt-4">
                            <Link
                                href="/scan"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                <QrCode className="w-5 h-5" />
                                {t('verifier.hero.scanButton')}
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-4 py-16 bg-white/50 dark:bg-gray-900/50">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Shield,
                                title: t('verifier.stats.verified'),
                                description: 'Vérification instantanée et sécurisée',
                                bgClass: 'bg-purple-100 dark:bg-purple-900/30',
                                iconClass: 'text-purple-600 dark:text-purple-400'
                            },
                            {
                                icon: CheckCircle,
                                title: 'Blockchain Cardano',
                                description: 'Technologie infalsifiable',
                                bgClass: 'bg-blue-100 dark:bg-blue-900/30',
                                iconClass: 'text-blue-600 dark:text-blue-400'
                            },
                            {
                                icon: Clock,
                                title: 'Rapide & Simple',
                                description: 'Résultats en quelques secondes',
                                bgClass: 'bg-green-100 dark:bg-green-900/30',
                                iconClass: 'text-green-600 dark:text-green-400'
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="group p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                            >
                                <div className={`inline-flex p-4 rounded-2xl ${feature.bgClass} mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className={`w-8 h-8 ${feature.iconClass}`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recent Verifications */}
            {recentVerifications.length > 0 && (
                <section className="px-4 py-16">
                    <div className="container mx-auto max-w-6xl">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {t('verifier.recent.title')}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Dernières vérifications effectuées
                                </p>
                            </div>
                            <Link
                                href="/documents"
                                className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium"
                            >
                                {t('verifier.recent.viewAll')}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recentVerifications.map((verification, index) => (
                                    verification.metadata && (
                                        <div key={index} className="transform hover:-translate-y-1 transition-transform duration-300">
                                            <InstitutionCard
                                                metadata={verification.metadata}
                                                txHash={verification.txHash}
                                                verified={verification.valid}
                                                onClick={() => router.push(`/verify/${encodeURIComponent(verification.policyId + (verification.assetName || ''))}`)}
                                            />
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}
