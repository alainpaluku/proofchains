/**
 * PROOFCHAIN Verifier - Verification Page
 * Real NFT verification using API (Supabase + Blockfrost)
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    CheckCircle2,
    XCircle,
    ArrowLeft,
    ExternalLink,
    Download,
    Calendar,
    Building2,
    GraduationCap,
    Award,
    User,
    Hash
} from 'lucide-react';
import { IPFSImage } from '@proofchain/ui';

// Helper function to convert IPFS URL to gateway URL (avoid importing @proofchain/chain which has WASM)
function getIPFSGatewayUrl(ipfsUrl: string): string {
    if (!ipfsUrl) return '';
    if (ipfsUrl.startsWith('ipfs://')) {
        const hash = ipfsUrl.replace('ipfs://', '');
        return `https://gateway.pinata.cloud/ipfs/${hash}`;
    }
    return ipfsUrl;
}

// Type pour la réponse de l'API de vérification
interface VerificationResponse {
    valid: boolean;
    source: 'supabase' | 'blockchain' | 'both';
    document?: {
        documentId: string;
        studentName: string;
        studentNumber: string;
        degree: string;
        fieldOfStudy: string;
        institution: string;
        institutionCode: string;
        graduationDate: string;
        issueDate: string;
        status: string;
        ipfsUrl?: string;
        txHash?: string;
        assetId?: string;
        policyId?: string;
    };
    blockchain?: {
        verified: boolean;
        txHash?: string;
        mintedAt?: string;
        policyId?: string;
    };
    error?: string;
}

export default function VerifyPage() {
    const params = useParams();
    const router = useRouter();
    const queryId = params.assetId as string;

    const [verification, setVerification] = useState<VerificationResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (queryId) {
            performVerification();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryId]);

    // Save to local history
    const saveToHistory = (data: VerificationResponse) => {
        try {
            const historyKey = 'verificationHistory';
            const existing = localStorage.getItem(historyKey);
            const history = existing ? JSON.parse(existing) : [];
            
            // Create new entry
            const newEntry = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                assetId: queryId,
                timestamp: Date.now(),
                valid: data.valid,
                diplomaName: data.document ? `${data.document.degree} - ${data.document.fieldOfStudy}` : undefined,
                studentName: data.document?.studentName,
            };
            
            // Remove duplicate if exists
            const filtered = history.filter((h: { assetId: string }) => h.assetId !== queryId);
            
            // Add new entry at the beginning, keep max 20 entries
            const updated = [newEntry, ...filtered].slice(0, 20);
            localStorage.setItem(historyKey, JSON.stringify(updated));
        } catch (err) {
            console.error('Error saving to history:', err);
        }
    };

    async function performVerification() {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/verify?q=${encodeURIComponent(queryId)}`);
            const data: VerificationResponse = await response.json();
            setVerification(data);
            saveToHistory(data);
        } catch (error) {
            console.error('Verification error:', error);
            const errorData = {
                valid: false,
                source: 'supabase' as const,
                error: 'Failed to verify diploma',
            };
            setVerification(errorData);
            saveToHistory(errorData);
        } finally {
            setIsLoading(false);
        }
    }

    const assetId = verification?.document?.assetId || queryId;

    const explorerUrl = process.env.NEXT_PUBLIC_CARDANO_EXPLORER || 'https://preprod.cardanoscan.io';
    const locale = 'fr-FR';

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
                ) : verification?.valid && verification.document ? (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Verification Status */}
                        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-2xl p-6">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-12 h-12 text-green-600" />
                                <div>
                                    <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
                                        Diplôme Authentique
                                    </h2>
                                    <p className="text-green-600 dark:text-green-500">
                                        Ce document a été vérifié et est authentique
                                        {verification.source === 'both' && ' ✓ Blockchain'}
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
                                        {verification.document.studentName}
                                    </h3>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                {verification.document.ipfsUrl && (
                                    <div className="mb-6">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                                            📄 Image du diplôme:
                                        </p>
                                        <div className="relative rounded-xl overflow-hidden border-2 border-purple-200 dark:border-purple-800 shadow-lg bg-gray-50 dark:bg-gray-900 min-h-[300px]">
                                            <IPFSImage
                                                src={getIPFSGatewayUrl(verification.document.ipfsUrl)}
                                                alt={verification.document.studentName}
                                                className="w-full h-auto max-h-[500px]"
                                                fallbackText="Image du diplôme"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <Hash className="w-6 h-6 text-gray-600 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">ID du document</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white font-mono">
                                            {verification.document.documentId}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <User className="w-6 h-6 text-gray-600 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Numéro étudiant</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {verification.document.studentNumber}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-3">
                                        <GraduationCap className="w-6 h-6 text-purple-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Diplôme</p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {verification.document.degree}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Award className="w-6 h-6 text-blue-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Filière</p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {verification.document.fieldOfStudy}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Building2 className="w-6 h-6 text-indigo-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Institution</p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {verification.document.institution}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                ({verification.document.institutionCode})
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-6 h-6 text-green-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Date de graduation</p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {new Date(verification.document.graduationDate).toLocaleDateString(locale)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {verification.document.ipfsUrl && (
                                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <a
                                            href={getIPFSGatewayUrl(verification.document.ipfsUrl)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                                        >
                                            <Download className="w-5 h-5" />
                                            Télécharger le document
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
                                {verification.document.policyId && (
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Policy ID</p>
                                        <p className="font-mono text-gray-900 dark:text-white break-all">
                                            {verification.document.policyId}
                                        </p>
                                    </div>
                                )}

                                {verification.document.assetId && (
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Asset ID</p>
                                        <p className="font-mono text-gray-900 dark:text-white break-all">
                                            {verification.document.assetId}
                                        </p>
                                    </div>
                                )}

                                {(verification.document.txHash || verification.blockchain?.txHash) && (
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Hash de transaction</p>
                                        <a
                                            href={`${explorerUrl}/transaction/${verification.document.txHash || verification.blockchain?.txHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-mono break-all"
                                        >
                                            {verification.document.txHash || verification.blockchain?.txHash}
                                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                        </a>
                                    </div>
                                )}

                                {verification.blockchain?.mintedAt && (
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Date de mint</p>
                                        <p className="text-gray-900 dark:text-white">
                                            {new Date(verification.blockchain.mintedAt).toLocaleString(locale)}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">Date d'émission</p>
                                    <p className="text-gray-900 dark:text-white">
                                        {new Date(verification.document.issueDate).toLocaleDateString(locale)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-2xl p-8 text-center">
                            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
                                Document Non Vérifié
                            </h2>
                            <p className="text-red-600 dark:text-red-500 mb-4">
                                {verification?.error || 'Ce document n\'a pas pu être vérifié'}
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
