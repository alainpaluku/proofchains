'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Award, Building2, Users, DollarSign, Loader2 } from 'lucide-react';
import { Card, CardHeader, StatCard } from '@proofchain/ui';
import { adminService } from '@proofchain/shared';

interface AdminStats {
    totalInstitutions: number;
    pendingKYC: number;
    approvedKYC: number;
    rejectedKYC: number;
    totalDocuments: number;
    totalStudents: number;
}

export default function StatisticsPage() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        const result = await adminService.getAdminStats();
        if (result.success && result.data) {
            setStats(result.data);
        }
        setLoading(false);
    };

    const globalStats = [
        {
            icon: Building2,
            iconBgClass: 'bg-purple-100 dark:bg-purple-900/30',
            iconClass: 'text-purple-600 dark:text-purple-400',
            value: loading ? '...' : String(stats?.totalInstitutions || 0),
            label: 'Institutions totales',
            change: `${stats?.approvedKYC || 0} approuvées`
        },
        {
            icon: Award,
            iconBgClass: 'bg-blue-100 dark:bg-blue-900/30',
            iconClass: 'text-blue-600 dark:text-blue-400',
            value: loading ? '...' : String(stats?.totalDocuments || 0),
            label: 'Diplômes émis',
            change: 'Total'
        },
        {
            icon: Users,
            iconBgClass: 'bg-green-100 dark:bg-green-900/30',
            iconClass: 'text-green-600 dark:text-green-400',
            value: loading ? '...' : String(stats?.totalStudents || 0),
            label: 'Étudiants enregistrés',
            change: 'Total'
        },
        {
            icon: DollarSign,
            iconBgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
            iconClass: 'text-yellow-600 dark:text-yellow-400',
            value: '$0',
            label: 'Revenus totaux',
            change: 'À venir'
        }
    ];

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                    Statistiques globales
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Vue d'ensemble des performances de la plateforme
                </p>
            </div>

            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {globalStats.map((stat, index) => (
                    <StatCard
                        key={index}
                        icon={stat.icon}
                        iconBgClass={stat.iconBgClass}
                        iconClass={stat.iconClass}
                        value={stat.value}
                        label={stat.label}
                        change={stat.change}
                    />
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader 
                        icon={TrendingUp}
                        title="Diplômes émis par mois" 
                    />
                    <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <p className="text-gray-500 dark:text-gray-400">Graphique à venir</p>
                    </div>
                </Card>

                <Card>
                    <CardHeader 
                        icon={Building2}
                        title="Nouvelles institutions" 
                    />
                    <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <p className="text-gray-500 dark:text-gray-400">Graphique à venir</p>
                    </div>
                </Card>
            </div>

            {/* Revenue by Plan */}
            <Card>
                <CardHeader 
                    icon={DollarSign}
                    title="Revenus par plan d'abonnement" 
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Starter', 'Professional', 'Enterprise'].map((plan) => (
                        <div key={plan} className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{plan}</h4>
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">$0</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">0 abonnements actifs</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* KYC Status */}
            <Card>
                <CardHeader title="Statut KYC des institutions" />
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                            <h4 className="text-lg font-semibold text-yellow-700 dark:text-yellow-400 mb-2">En attente</h4>
                            <p className="text-3xl font-bold text-yellow-600">{stats?.pendingKYC || 0}</p>
                            <p className="text-sm text-yellow-600/70">Demandes à traiter</p>
                        </div>
                        <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                            <h4 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">Approuvées</h4>
                            <p className="text-3xl font-bold text-green-600">{stats?.approvedKYC || 0}</p>
                            <p className="text-sm text-green-600/70">Institutions validées</p>
                        </div>
                        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                            <h4 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Rejetées</h4>
                            <p className="text-3xl font-bold text-red-600">{stats?.rejectedKYC || 0}</p>
                            <p className="text-sm text-red-600/70">Demandes refusées</p>
                        </div>
                    </div>
                )}
            </Card>

            {/* Top Institutions */}
            <Card>
                <CardHeader title="Résumé de la plateforme" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <p className="text-2xl font-bold text-purple-600">{stats?.totalInstitutions || 0}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Institutions</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <p className="text-2xl font-bold text-blue-600">{stats?.totalDocuments || 0}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Diplômes</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <p className="text-2xl font-bold text-green-600">{stats?.totalStudents || 0}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Étudiants</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <p className="text-2xl font-bold text-yellow-600">{stats?.approvedKYC || 0}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">KYC Validés</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
