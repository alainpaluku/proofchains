/**
 * PROOFCHAIN - Institution Card Component
 * Display diploma/NFT information
 */

'use client';

import React from 'react';
import { GraduationCap, Calendar, Award, Building2, CheckCircle2, ExternalLink, FileText } from 'lucide-react';

// Données complètes du diplôme (depuis Supabase)
interface DiplomaData {
    documentId: string;
    studentName?: string;
    studentId?: string;
    degree?: string;
    field?: string;
    institution?: string;
    graduationDate?: string;
    issueDate?: string;
}

interface InstitutionCardProps {
    data: DiplomaData;
    assetId?: string;
    txHash?: string;
    verified?: boolean;
    className?: string;
    onClick?: () => void;
}

export function InstitutionCard({
    data,
    assetId,
    txHash,
    verified = false,
    className = '',
    onClick,
}: InstitutionCardProps) {
    const explorerUrl = process.env.NEXT_PUBLIC_CARDANO_EXPLORER || 'https://preprod.cardanoscan.io';

    return (
        <div
            className={`
                relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all
                ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
                ${className}
            `}
            onClick={onClick}
        >
            {/* Gradient header */}
            <div className="h-32 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 relative">
                <div className="absolute inset-0 bg-black/10" />
                {verified && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                        <CheckCircle2 className="w-4 h-4" />
                        Verified
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Student name or Document ID */}
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {data.studentName || 'Document Vérifié'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {data.studentId || data.documentId}
                    </p>
                </div>

                {/* Degree info */}
                <div className="space-y-2">
                    {data.degree && (
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <GraduationCap className="w-5 h-5 text-purple-600" />
                            <span className="font-medium">{data.degree}</span>
                        </div>
                    )}

                    {data.field && (
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Award className="w-5 h-5 text-blue-600" />
                            <span>{data.field}</span>
                        </div>
                    )}

                    {data.institution && (
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Building2 className="w-5 h-5 text-indigo-600" />
                            <span>{data.institution}</span>
                        </div>
                    )}

                    {data.graduationDate && (
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Calendar className="w-5 h-5 text-green-600" />
                            <span>{new Date(data.graduationDate).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                {/* Transaction link */}
                {txHash && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <a
                            href={`${explorerUrl}/transaction/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink className="w-4 h-4" />
                            View on Cardano Explorer
                        </a>
                    </div>
                )}

                {/* Asset ID */}
                {assetId && (
                    <div className="text-xs text-gray-500 dark:text-gray-500 font-mono break-all">
                        {assetId}
                    </div>
                )}
            </div>
        </div>
    );
}
