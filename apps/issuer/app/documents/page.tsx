'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    FileText, Search, RefreshCw, ExternalLink, QrCode, Trash2, XCircle,
    CheckCircle2, Clock, AlertTriangle, Filter, Loader2, X
} from 'lucide-react';
import { LoadingSpinner } from '@proofchain/ui';
import { documentService, issuerService, getCurrentUser } from '@proofchain/shared';
import type { Document, Student } from '@proofchain/shared';

interface DocumentWithStudent extends Document {
    student?: Student;
}

type FilterStatus = 'all' | 'issued' | 'draft' | 'revoked';

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<DocumentWithStudent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    
    // Modal de révocation
    const [showRevokeModal, setShowRevokeModal] = useState(false);
    const [revokeDoc, setRevokeDoc] = useState<DocumentWithStudent | null>(null);
    const [revokeReason, setRevokeReason] = useState('');
    const [revoking, setRevoking] = useState(false);

    const landingUrl = process.env.NEXT_PUBLIC_LANDING_URL || 'https://proofchains.org';
    const explorerUrl = process.env.NEXT_PUBLIC_CARDANO_EXPLORER || 'https://preprod.cardanoscan.io';

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const instResult = await issuerService.getMyInstitution();
            if (instResult.success && instResult.data) {
                const docsResult = await documentService.getByInstitution(instResult.data.id);
                if (docsResult.success && docsResult.data) {
                    setDocuments(docsResult.data);
                }
            } else {
                setError('Veuillez d\'abord créer votre institution.');
            }
        } catch {
            setError('Erreur lors du chargement des documents.');
        }
        setLoading(false);
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const getStatusIcon = (status: string | null) => {
        switch (status) {
            case 'issued': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'draft': return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'revoked': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusLabel = (status: string | null) => {
        switch (status) {
            case 'issued': return 'Émis';
            case 'draft': return 'Brouillon';
            case 'revoked': return 'Révoqué';
            default: return 'Inconnu';
        }
    };

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case 'issued': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            case 'draft': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
            case 'revoked': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
        }
    };

    const handleRevoke = async () => {
        if (!revokeDoc || !revokeReason.trim()) return;
        
        setRevoking(true);
        try {
            const user = await getCurrentUser();
            const revokedBy = user?.id || 'unknown';
            
            const result = await documentService.revoke(revokeDoc.id, revokeReason.trim(), revokedBy);
            if (result.success) {
                setDocuments(prev => prev.map(d => 
                    d.id === revokeDoc.id ? { ...d, status: 'revoked' } : d
                ));
                setShowRevokeModal(false);
                setRevokeDoc(null);
                setRevokeReason('');
            } else {
                alert(result.error || 'Erreur lors de la révocation');
            }
        } catch {
            alert('Erreur lors de la révocation');
        }
        setRevoking(false);
    };

    const handleDelete = async (doc: DocumentWithStudent) => {
        if (doc.status !== 'draft') {
            alert('Seuls les brouillons peuvent être supprimés');
            return;
        }
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce brouillon ?')) return;
        
        const result = await documentService.deleteDraft(doc.id);
        if (result.success) {
            setDocuments(prev => prev.filter(d => d.id !== doc.id));
        } else {
            alert(result.error || 'Erreur lors de la suppression');
        }
    };

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = 
            doc.document_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.degree_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.field_of_study?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.student?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
        
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" />
                        Documents émis
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {documents.length} document{documents.length > 1 ? 's' : ''}
                    </p>
                </div>
                <button 
                    onClick={() => loadData()} 
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    Actualiser
                </button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Filtres */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            placeholder="Rechercher un document..." 
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent" 
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600"
                        >
                            <option value="all">Tous</option>
                            <option value="issued">Émis</option>
                            <option value="draft">Brouillons</option>
                            <option value="revoked">Révoqués</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Liste des documents */}
            <div className="space-y-4">
                {filteredDocuments.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">Aucun document trouvé</p>
                    </div>
                ) : (
                    filteredDocuments.map((doc) => (
                        <div key={doc.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {doc.degree_type} - {doc.field_of_study}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(doc.status)}`}>
                                            {getStatusIcon(doc.status)}
                                            {getStatusLabel(doc.status)}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div>
                                            <span className="font-medium">Étudiant:</span> {doc.student?.full_name || 'N/A'}
                                        </div>
                                        <div>
                                            <span className="font-medium">ID:</span> {doc.document_id || 'N/A'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Date:</span> {doc.issue_date ? new Date(doc.issue_date).toLocaleDateString('fr-FR') : 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {doc.status === 'issued' && doc.document_id && (
                                        <>
                                            <a
                                                href={`${landingUrl}/verify/${doc.document_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                                title="Vérifier"
                                            >
                                                <QrCode className="w-5 h-5" />
                                            </a>
                                            {doc.tx_hash && (
                                                <a
                                                    href={`${explorerUrl}/transaction/${doc.tx_hash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="Voir sur l'explorateur"
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => { setRevokeDoc(doc); setShowRevokeModal(true); }}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Révoquer"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                    {doc.status === 'draft' && (
                                        <button
                                            onClick={() => handleDelete(doc)}
                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Supprimer le brouillon"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de révocation */}
            {showRevokeModal && revokeDoc && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Révoquer le document</h3>
                            <button
                                onClick={() => { setShowRevokeModal(false); setRevokeDoc(null); setRevokeReason(''); }}
                                className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Vous êtes sur le point de révoquer le document <strong>{revokeDoc.document_id}</strong>. Cette action est irréversible.
                        </p>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Raison de la révocation *
                            </label>
                            <textarea
                                value={revokeReason}
                                onChange={(e) => setRevokeReason(e.target.value)}
                                placeholder="Expliquez pourquoi ce document est révoqué..."
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
                                rows={3}
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowRevokeModal(false); setRevokeDoc(null); setRevokeReason(''); }}
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleRevoke}
                                disabled={revoking || !revokeReason.trim()}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {revoking ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Révocation...
                                    </>
                                ) : (
                                    'Révoquer'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
