'use client';
// Issuer Dashboard - Proofchains v1.0
import React, { useEffect, useState } from 'react';
import { Coins, Users, FileCheck, Award, Clock, ExternalLink, QrCode } from 'lucide-react';
import Link from 'next/link';
import { StatCard, Card, CardHeader } from '@proofchain/ui';
import { documentService, studentService, issuerService, type Document, type Student } from '@proofchain/shared';

interface DocumentWithStudent extends Document {
    student?: Student;
}

export default function HomePage() {
    const [loading, setLoading] = useState(true);
    const [statsData, setStatsData] = useState({ total: 0, issued: 0, draft: 0, revoked: 0 });
    const [studentsCount, setStudentsCount] = useState(0);
    const [recentDocuments, setRecentDocuments] = useState<DocumentWithStudent[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const instResult = await issuerService.getMyInstitution();
            if (instResult.success && instResult.data) {
                const institutionId = instResult.data.id;

                // Load stats
                const statsResult = await documentService.getStats(institutionId);
                if (statsResult.success && statsResult.data) {
                    setStatsData(statsResult.data);
                }

                // Load students count
                const studentsResult = await studentService.getByInstitution(institutionId);
                if (studentsResult.success && studentsResult.data) {
                    setStudentsCount(studentsResult.data.length);
                }

                // Load recent documents
                const docsResult = await documentService.getByInstitution(institutionId);
                if (docsResult.success && docsResult.data) {
                    setRecentDocuments(docsResult.data.slice(0, 5));
                }
            }
        } catch (err) {
            console.error('Erreur chargement données:', err);
        }
        setLoading(false);
    };

    const stats = [
        {
            label: 'Diplômes émis',
            value: loading ? '...' : String(statsData.issued),
            change: `${statsData.total} total`,
            icon: Award,
            bgClass: 'bg-purple-100 dark:bg-purple-900/30',
            iconClass: 'text-purple-600 dark:text-purple-400'
        },
        {
            label: 'Étudiants',
            value: loading ? '...' : String(studentsCount),
            change: 'Enregistrés',
            icon: Users,
            bgClass: 'bg-blue-100 dark:bg-blue-900/30',
            iconClass: 'text-blue-600 dark:text-blue-400'
        },
        {
            label: 'Brouillons',
            value: loading ? '...' : String(statsData.draft),
            change: 'En attente',
            icon: Clock,
            bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
            iconClass: 'text-yellow-600 dark:text-yellow-400'
        },
        {
            label: 'Révoqués',
            value: loading ? '...' : String(statsData.revoked),
            change: 'Annulés',
            icon: FileCheck,
            bgClass: 'bg-red-100 dark:bg-red-900/30',
            iconClass: 'text-red-600 dark:text-red-400'
        }
    ];

    const landingUrl = process.env.NEXT_PUBLIC_LANDING_URL || 'https://proofchains.org';
    const explorerUrl = process.env.NEXT_PUBLIC_CARDANO_EXPLORER || 'https://preprod.cardanoscan.io';

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Tableau de bord
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Vue d'ensemble de votre activité
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        icon={stat.icon}
                        iconBgClass={stat.bgClass}
                        iconClass={stat.iconClass}
                        value={stat.value}
                        label={stat.label}
                        change={stat.change}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href="/mint"
                    className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all hover:-translate-y-1"
                >
                    <Coins className="w-8 h-8 mb-3" />
                    <h3 className="text-xl font-bold mb-2">Émettre un diplôme</h3>
                    <p className="text-purple-100">Créer un nouveau NFT diplôme</p>
                </Link>

                <Link
                    href="/students"
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Gérer les étudiants</h3>
                    <p className="text-gray-600 dark:text-gray-400">Voir et modifier les profils</p>
                </Link>

                <Link
                    href="/kyc"
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                    <FileCheck className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Valider KYC</h3>
                    <p className="text-gray-600 dark:text-gray-400">Vérifier les identités</p>
                </Link>
            </div>

            <Card>
                <CardHeader title="Documents récents" />
                <div className="space-y-4">
                    {recentDocuments.length === 0 ? (
                        <div className="text-center py-8">
                            <Award className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-600 dark:text-gray-400">Aucun document émis</p>
                            <Link href="/mint" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                                Émettre un diplôme →
                            </Link>
                        </div>
                    ) : (
                        recentDocuments.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${doc.status === 'issued' ? 'bg-green-500' : doc.status === 'draft' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {doc.student?.full_name || 'Étudiant'}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {doc.degree_type} - {doc.field_of_study}
                                        </p>
                                        <p className="text-xs text-gray-500 font-mono">{doc.document_id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {doc.status === 'issued' && (
                                        <>
                                            <a
                                                href={`${landingUrl}/verify/${doc.document_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                                                title="Vérifier"
                                            >
                                                <QrCode className="w-5 h-5" />
                                            </a>
                                            {doc.tx_hash && (
                                                <a
                                                    href={`${explorerUrl}/transaction/${doc.tx_hash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                    title="Voir sur blockchain"
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                </a>
                                            )}
                                        </>
                                    )}
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        doc.status === 'issued' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        doc.status === 'draft' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                        {doc.status === 'issued' ? 'Émis' : doc.status === 'draft' ? 'Brouillon' : 'Révoqué'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
