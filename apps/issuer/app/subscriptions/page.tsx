'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Check, Zap, Crown, Star, Loader2 } from 'lucide-react';
import { issuerService, documentService } from '@proofchain/shared';

export default function SubscriptionsPage() {
    const [currency, setCurrency] = useState<'USD' | 'CDF'>('USD');
    const [loading, setLoading] = useState(true);
    const [currentPlan, setCurrentPlan] = useState<string>('starter');
    const [stats, setStats] = useState({ issued: 0, total: 0 });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const instResult = await issuerService.getMyInstitution();
            if (instResult.success && instResult.data) {
                setCurrentPlan(instResult.data.subscription_plan || 'starter');
                
                const statsResult = await documentService.getStats(instResult.data.id);
                if (statsResult.success && statsResult.data) {
                    setStats({ issued: statsResult.data.issued, total: statsResult.data.total });
                }
            }
        } catch (err) {
            console.error('Erreur:', err);
        }
        setLoading(false);
    };

    const plans = [
        { id: 'free', name: 'Gratuit', priceUSD: 0, priceCDF: 0, period: 'mois', icon: Zap, color: 'blue', limit: 10, features: ['Jusqu\'à 10 diplômes/mois', 'Stockage IPFS limité', 'Support email', 'Dashboard basique'] },
        { id: 'basic', name: 'Basic', priceUSD: 15, priceCDF: 40_000, period: 'mois', icon: Zap, color: 'blue', limit: 50, features: ['Jusqu\'à 50 diplômes/mois', 'Stockage IPFS inclus', 'Support email', 'Dashboard basique', 'API access'] },
        { id: 'premium', name: 'Premium', priceUSD: 45, priceCDF: 120_000, period: 'mois', icon: Crown, color: 'purple', limit: 500, features: ['Jusqu\'à 500 diplômes/mois', 'Stockage IPFS illimité', 'Support prioritaire 24/7', 'Dashboard avancé', 'API illimitée', 'Validation KYC automatique', 'Branding personnalisé'], popular: true },
        { id: 'enterprise', name: 'Enterprise', priceUSD: null, priceCDF: null, period: '', icon: Star, color: 'indigo', limit: -1, features: ['Diplômes illimités', 'Infrastructure dédiée', 'Support dédié 24/7', 'SLA garanti 99.9%', 'Intégration personnalisée', 'Formation équipe'] }
    ];

    const activePlan = plans.find(p => p.id === currentPlan) || plans[0];

    const formatPrice = (priceUSD: number | null, priceCDF: number | null) => {
        if (priceUSD === null || priceCDF === null) return 'Sur mesure';
        return currency === 'USD' ? `$${priceUSD}` : `${priceCDF.toLocaleString('fr-FR')} FC`;
    };

    const colorClasses: Record<string, { bg: string; text: string; button: string }> = {
        blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', button: 'bg-blue-600 hover:bg-blue-700' },
        purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', button: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' },
        indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400', button: 'bg-indigo-600 hover:bg-indigo-700' }
    };

    const usagePercent = activePlan.limit > 0 ? Math.min((stats.issued / activePlan.limit) * 100, 100) : 0;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
            <div className="text-center">
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">Choisissez votre plan</h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4">Des solutions adaptées à vos besoins d'émission de diplômes</p>
                <div className="inline-flex items-center gap-1 sm:gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <button onClick={() => setCurrency('USD')} className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${currency === 'USD' ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-md' : 'text-gray-600 dark:text-gray-400'}`}>USD ($)</button>
                    <button onClick={() => setCurrency('CDF')} className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${currency === 'CDF' ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-md' : 'text-gray-600 dark:text-gray-400'}`}>FC</button>
                </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-4 sm:p-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold mb-1">Plan actuel: {activePlan.name}</h2>
                        <p className="text-purple-100 text-sm sm:text-base">
                            {activePlan.limit > 0 ? `Limite: ${activePlan.limit} diplômes/mois` : 'Diplômes illimités'}
                        </p>
                    </div>
                    <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 text-white/80 hidden sm:block" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-purple-100 text-sm mb-1">Diplômes émis</p>
                        <p className="text-2xl sm:text-3xl font-bold">
                            {stats.issued} {activePlan.limit > 0 && `/ ${activePlan.limit}`}
                        </p>
                        {activePlan.limit > 0 && (
                            <div className="mt-2 bg-white/20 rounded-full h-2">
                                <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${usagePercent}%` }} />
                            </div>
                        )}
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-purple-100 text-sm mb-1">Total documents</p>
                        <p className="text-2xl sm:text-3xl font-bold">{stats.total}</p>
                        <p className="text-purple-100 text-sm mt-1">Tous statuts</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:col-span-2 lg:col-span-1">
                        <p className="text-purple-100 text-sm mb-1">Stockage IPFS</p>
                        <p className="text-2xl sm:text-3xl font-bold">{activePlan.limit > 0 ? 'Inclus' : 'Illimité'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {plans.map((plan) => {
                    const colors = colorClasses[plan.color] || colorClasses.blue;
                    const isCurrent = plan.id === currentPlan;
                    return (
                        <div key={plan.id} className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 p-6 sm:p-8 ${plan.popular ? 'border-purple-500 dark:border-purple-600 md:scale-105' : 'border-gray-200 dark:border-gray-700'} ${isCurrent ? 'ring-4 ring-purple-200 dark:ring-purple-900/50' : ''}`}>
                            {plan.popular && (<div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold rounded-full">POPULAIRE</div>)}
                            {isCurrent && (<div className="absolute -top-3 right-4 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">ACTUEL</div>)}
                            <div className={`inline-flex p-3 rounded-xl ${colors.bg} mb-4`}><plan.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${colors.text}`} /></div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                            <div className="mb-6">
                                <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{formatPrice(plan.priceUSD, plan.priceCDF)}</span>
                                {plan.period && (<span className="text-gray-600 dark:text-gray-400">/{plan.period}</span>)}
                            </div>
                            <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2 sm:gap-3">
                                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button 
                                className={`w-full py-3 ${colors.button} text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl ${isCurrent ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                disabled={isCurrent}
                            >
                                {isCurrent ? 'Plan actuel' : plan.period ? 'Choisir ce plan' : 'Nous contacter'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
