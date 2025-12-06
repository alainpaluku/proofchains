/**
 * PROOFCHAIN Verifier - Verification Page
 * Real NFT verification using Blockfrost API
 * Uses query params: /verify?assetId=xxx
 */

'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    CheckCircle2,
    XCircle,
    ArrowLeft,
    ExternalLink,
    Download,
    Calendar,
    Building2,
    GraduationCap,
    Award
} from 'lucide-react';
import { verifyNFT, type VerificationResult, getIPFSGatewayUrl } from '@proofchain/chain';
import { IPFSImage } from '@proofchain/ui';

function VerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const assetId = searchParams.get('assetId') || searchParams.get('id') || '';

    const [verification, setVerification] = useState<VerificationResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (assetId) {
            performVerification();
        } else {
            setIsLoading(false);
        }
    }, [assetId]);

    async function performVerification() {
        setIsLoading(true);
        try {
            const result = await verifyNFT(assetId);
            setVerification(result);
        } catch (error) {
            console.error('Verification error:', error);
            setVerification({
                valid: false,
                error: 'Failed to verify diploma',
            });
        } finally {
            setIsLoading(false);
        }
    }

    const explorerUrl = process.env.NEXT_PUBLIC_CARDANO_EXPLORER || 'https://preprod.cardanoscan.io';

    if (!assetId) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Aucun diplôme spécifié
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Veuillez scanner un QR code ou entrer un ID de diplôme
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full">
            <div className="container mx-auto px-4 py-12">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Retour
                </button>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-lg text-gray-600 dark:text-gray-400">Vérification en cours...</p>
                    </div>
                ) : verification?.valid && verification.metadata ? (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Verification Status */}
                        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-2xl p-6">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-12 h-12 text-green-600" />
                                <div>
                                    <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
                                        Diplôme Vérifié ✓
                                    </h2>
                                    <p className="text-green-600 dark:text-green-500">
                                        Ce diplôme est authentique et enregistré sur la blockchain Cardano
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Diploma Details */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                            <div className="h-40 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 relative">
                                <div className="absolute inset-0 bg-black/10" />
                                <div className="absolute bottom-4 left-6">
                                    <h3 className="text-3xl font-bold text-white">
                                        {verification.metadata.attributes.studentName}
                                    </h3>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                {verification.metadata.image && (
                                    <div className="mb-6">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                                            📄 Image du Diplôme:
                                        </p>
                                        <div className="relative rounded-xl overflow-hidden border-2 border-purple-200 dark:border-purple-800 shadow-lg bg-gray-50 dark:bg-gray-900 min-h-[300px]">
                                            <IPFSImage
                                                src={getIPFSGatewayUrl(verification.metadata.image)}
                                                alt={`Diplôme de ${verification.metadata.attributes.studentName}`}
                                                className="w-full h-auto max-h-[500px]"
                                                fallbackText="Image du diplôme non disponible"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">ID Étudiant</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {verification.metadata.attributes.studentId}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-3">
                                        <GraduationCap className="w-6 h-6 text-purple-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Diplôme</p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {verification.metadata.attributes.degree}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Award className="w-6 h-6 text-blue-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Domaine</p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {verification.metadata.attributes.field}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Building2 className="w-6 h-6 text-indigo-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Institution</p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {verification.metadata.attributes.institution}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-6 h-6 text-green-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Date d'obtention</p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {new Date(verification.metadata.attributes.graduationDate).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {((verification.metadata.attributes as any).honors || (verification.metadata.attributes as any).grade) && (
                                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {(verification.metadata.attributes as any).honors && (
                                            <div className="inline-block px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg font-medium">
                                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                🏆 {(verification.metadata.attributes as any).honors}
                                            </div>
                                        )}
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {(verification.metadata.attributes as any).grade && (
                                            <p className="mt-3 text-gray-700 dark:text-gray-300">
                                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                Note: <span className="font-bold">{(verification.metadata.attributes as any).grade}</span>
                                            </p>
                                        )}
                                    </div>
                                )}

                                {verification.metadata.attributes.documentHash && (
                                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <a
                                            href={getIPFSGatewayUrl(verification.metadata.attributes.documentHash)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                                        >
                                            <Download className="w-5 h-5" />
                                            Télécharger le document original
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Blockchain Information */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 space-y-4">
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                Informations Blockchain
                            </h4>

                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">Policy ID</p>
                                    <p className="font-mono text-gray-900 dark:text-white break-all">
                                        {verification.policyId}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">Asset ID</p>
                                    <p className="font-mono text-gray-900 dark:text-white break-all">
                                        {assetId}
                                    </p>
                                </div>

                                {verification.txHash && (
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Transaction Hash</p>
                                        <a
                                            href={`${explorerUrl}/transaction/${verification.txHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-mono break-all"
                                        >
                                            {verification.txHash}
                                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                        </a>
                                    </div>
                                )}

                                {verification.mintedAt && (
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Date d'émission</p>
                                        <p className="text-gray-900 dark:text-white">
                                            {new Date(verification.mintedAt).toLocaleString('fr-FR')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-2xl p-8 text-center">
                            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
                                Diplôme Non Vérifié
                            </h2>
                            <p className="text-red-600 dark:text-red-500 mb-4">
                                {verification?.error || 'Ce diplôme n\'a pas pu être vérifié sur la blockchain'}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Asset ID: <span className="font-mono">{assetId}</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-lg text-gray-600 dark:text-gray-400">Chargement...</p>
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
