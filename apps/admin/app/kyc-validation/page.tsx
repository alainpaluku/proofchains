'use client';

import React, { useState, useEffect } from 'react';
import { FileCheck, CheckCircle, XCircle, Eye, Building2, Mail, Phone, Globe, Loader2 } from 'lucide-react';
import { Card, EmptyState, Button, LoadingSpinner } from '@proofchain/ui';
import { adminService, type KYCPendingRequest } from '@proofchain/shared';

interface KYCRequest {
    id: string;
    institutionName: string;
    email: string;
    phone: string;
    website: string;
    country: string;
    registrationNumber: string;
    submittedDate: string;
    documents: {
        registrationCert: boolean;
        ministerialDecree: boolean;
        taxCert: boolean;
    };
}

export default function KYCValidationPage() {
    const [requests, setRequests] = useState<KYCRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        const result = await adminService.getPendingKYCRequests();
        if (result.success && result.data) {
            const mapped: KYCRequest[] = result.data.map((req: KYCPendingRequest) => ({
                id: req.id,
                institutionName: req.name,
                email: req.email,
                phone: req.phone || '',
                website: req.website || '',
                country: req.countryCode,
                registrationNumber: req.registrationNumber || '',
                submittedDate: req.kycSubmittedAt 
                    ? new Date(req.kycSubmittedAt).toLocaleDateString('fr-FR')
                    : 'N/A',
                documents: {
                    registrationCert: !!req.documents.legalDocs,
                    ministerialDecree: !!req.documents.ministerialDecree,
                    taxCert: !!req.documents.taxCertificate,
                },
            }));
            setRequests(mapped);
        } else {
            setError(result.error || 'Erreur de chargement');
        }
        setLoading(false);
    };

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleApprove = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir approuver cette institution ?')) return;
        
        setActionLoading(id);
        setError(null);
        setSuccessMessage(null);
        
        const result = await adminService.approveKYC(id);
        if (result.success) {
            setRequests(prev => prev.filter(r => r.id !== id));
            setSuccessMessage('Institution approuvée avec succès !');
            setTimeout(() => setSuccessMessage(null), 3000);
        } else {
            setError(result.error || 'Erreur lors de l\'approbation');
        }
        setActionLoading(null);
    };

    const handleReject = async (id: string) => {
        const reason = prompt('Raison du rejet (obligatoire) :');
        if (!reason || reason.trim() === '') {
            alert('Veuillez fournir une raison pour le rejet');
            return;
        }
        
        setActionLoading(id);
        setError(null);
        setSuccessMessage(null);
        
        const result = await adminService.rejectKYC(id, reason);
        if (result.success) {
            setRequests(prev => prev.filter(r => r.id !== id));
            setSuccessMessage('Institution rejetée.');
            setTimeout(() => setSuccessMessage(null), 3000);
        } else {
            setError(result.error || 'Erreur lors du rejet');
        }
        setActionLoading(null);
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <FileCheck className="w-8 h-8 text-purple-600" />
                    Validation KYC
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {requests.length} demande{requests.length > 1 ? 's' : ''} en attente de validation
                </p>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            )}

            {/* Success */}
            {successMessage && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-green-700 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {successMessage}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* KYC Requests */}
            {!loading && requests.length === 0 ? (
                <EmptyState
                    icon={FileCheck}
                    title="Aucune demande KYC"
                    description="Les demandes de validation KYC apparaîtront ici"
                />
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {requests.map((request) => (
                        <Card key={request.id}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                        <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            {request.institutionName}
                                        </h3>
                                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                            <p className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                {request.email}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                {request.phone}
                                            </p>
                                            {request.website && (
                                                <p className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4" />
                                                    {request.website}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                                    En attente
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Pays</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{request.country}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">N° Enregistrement</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{request.registrationNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Date de soumission</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{request.submittedDate}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Documents fournis</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <div className={`flex items-center gap-2 p-2 rounded-lg ${request.documents.registrationCert ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                                        {request.documents.registrationCert ? (
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-600" />
                                        )}
                                        <span className="text-sm">Certificat d'enregistrement</span>
                                    </div>
                                    <div className={`flex items-center gap-2 p-2 rounded-lg ${request.documents.ministerialDecree ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                                        {request.documents.ministerialDecree ? (
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-600" />
                                        )}
                                        <span className="text-sm">Arrêté ministériel</span>
                                    </div>
                                    <div className={`flex items-center gap-2 p-2 rounded-lg ${request.documents.taxCert ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                                        {request.documents.taxCert ? (
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-600" />
                                        )}
                                        <span className="text-sm">Attestation fiscale</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" icon={Eye}>
                                    Voir documents
                                </Button>
                                <Button 
                                    variant="primary" 
                                    size="sm" 
                                    icon={actionLoading === request.id ? Loader2 : CheckCircle} 
                                    onClick={() => handleApprove(request.id)}
                                    disabled={actionLoading === request.id}
                                >
                                    {actionLoading === request.id ? 'Chargement...' : 'Approuver'}
                                </Button>
                                <Button 
                                    variant="danger" 
                                    size="sm" 
                                    icon={XCircle} 
                                    onClick={() => handleReject(request.id)}
                                    disabled={actionLoading === request.id}
                                >
                                    Rejeter
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
