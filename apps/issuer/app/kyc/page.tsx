'use client';

import React, { useState, useEffect } from 'react';
import { FileCheck, Upload, CheckCircle, XCircle, Clock, AlertCircle, Building2, FileText, Send, Loader2 } from 'lucide-react';
import { LoadingSpinner } from '@proofchain/ui';
import { issuerService, adminService } from '@proofchain/shared';
import type { InstitutionType, KYCStatus } from '@proofchain/shared';

interface KYCFormData {
    institutionName: string;
    institutionType: InstitutionType;
    countryCode: string;
    email: string;
    website: string;
    phone: string;
    address: string;
    taxId: string;
    registrationNumber: string;
}

const INSTITUTION_TYPES: { value: InstitutionType; label: string }[] = [
    { value: 'UN', label: 'Université' },
    { value: 'IS', label: 'Institut Supérieur' },
    { value: 'LC', label: 'Lycée / Collège' },
    { value: 'CF', label: 'Centre de Formation' },
];

export default function KYCPage() {
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
    const [rejectionReason, setRejectionReason] = useState<string | null>(null);
    const [countries, setCountries] = useState<{ code: string; name: string }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    const [formData, setFormData] = useState<KYCFormData>({
        institutionName: '', institutionType: 'UN', countryCode: 'CD', email: '',
        website: '', phone: '', address: '', taxId: '', registrationNumber: '',
    });

    const [documents, setDocuments] = useState({
        legalDocs: null as File | null, accreditation: null as File | null,
        taxCertificate: null as File | null, ministerialDecree: null as File | null,
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        const countriesResult = await adminService.getCountries();
        if (countriesResult.success && countriesResult.data) {
            setCountries(countriesResult.data);
        } else {
            setCountries([
                { code: 'CD', name: 'République Démocratique du Congo' },
                { code: 'CG', name: 'République du Congo' },
                { code: 'RW', name: 'Rwanda' },
                { code: 'FR', name: 'France' },
            ]);
        }
        const institutionResult = await issuerService.getMyInstitution();
        if (institutionResult.success && institutionResult.data) {
            const inst = institutionResult.data;
            setKycStatus(inst.kyc_status);
            setRejectionReason(inst.kyc_rejection_reason);
            setFormData({
                institutionName: inst.name || '', institutionType: inst.type || 'UN',
                countryCode: inst.country_code || 'CD', email: inst.email || '',
                website: inst.website || '', phone: inst.phone || '',
                address: inst.address || '', taxId: inst.tax_id || '',
                registrationNumber: inst.registration_number || '',
            });
        }
        setLoading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (field: keyof typeof documents) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setDocuments({ ...documents, [field]: file }); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);
        try {
            if (!formData.institutionName || !formData.email) {
                throw new Error('Le nom et l\'email sont obligatoires');
            }
            const result = await issuerService.submitKYC({
                institutionName: formData.institutionName, institutionType: formData.institutionType,
                countryCode: formData.countryCode, email: formData.email,
                website: formData.website || undefined, phone: formData.phone || undefined,
                address: formData.address || undefined, taxId: formData.taxId || undefined,
                registrationNumber: formData.registrationNumber || undefined,
            });
            if (result.success) {
                setKycStatus('pending');
                setSuccess('Demande KYC soumise avec succès ! Elle sera examinée sous 24-48h.');
            } else { throw new Error(result.error || 'Erreur lors de la soumission'); }
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la soumission');
        } finally { setIsSubmitting(false); }
    };

    const getStatusBadge = () => {
        switch (kycStatus) {
            case 'approved': return (<div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl"><CheckCircle className="w-5 h-5" /><span className="font-medium">KYC Approuvé</span></div>);
            case 'pending': return (<div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-xl"><Clock className="w-5 h-5" /><span className="font-medium">En cours de validation</span></div>);
            case 'rejected': return (<div className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl"><XCircle className="w-5 h-5" /><span className="font-medium">Rejeté</span></div>);
            default: return (<div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl"><AlertCircle className="w-5 h-5" /><span className="font-medium">Non soumis</span></div>);
        }
    };

    if (loading) { return (<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>); }

    return (
        <div className="p-6 space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <FileCheck className="w-8 h-8 text-purple-600" />
                        Vérification KYC
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Soumettez votre demande de vérification institutionnelle</p>
                </div>
                {getStatusBadge()}
            </div>

            {success && (<div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-2xl p-6"><div className="flex items-start gap-4"><CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" /><div><h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-2">Succès !</h3><p className="text-green-600 dark:text-green-500">{success}</p></div></div></div>)}
            {error && (<div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-2xl p-6"><div className="flex items-start gap-4"><XCircle className="w-8 h-8 text-red-600 flex-shrink-0" /><div><h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">Erreur</h3><p className="text-red-600 dark:text-red-500">{error}</p></div></div></div>)}

            {kycStatus === 'approved' && (<div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-2xl p-6"><div className="flex items-start gap-4"><CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" /><div><h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-2">Institution vérifiée ✓</h3><p className="text-green-600 dark:text-green-500">Vous pouvez maintenant émettre des diplômes NFT.</p></div></div></div>)}
            {kycStatus === 'pending' && (<div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-2xl p-6"><div className="flex items-start gap-4"><Clock className="w-8 h-8 text-yellow-600 flex-shrink-0" /><div><h3 className="text-lg font-bold text-yellow-700 dark:text-yellow-400 mb-2">En cours de validation</h3><p className="text-yellow-600 dark:text-yellow-500">Votre demande est en cours de traitement. Délai estimé : 24-48h.</p></div></div></div>)}
            {kycStatus === 'rejected' && (<div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-2xl p-6"><div className="flex items-start gap-4"><XCircle className="w-8 h-8 text-red-600 flex-shrink-0" /><div><h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">Demande rejetée</h3><p className="text-red-600 dark:text-red-500 mb-2">{rejectionReason || 'Votre demande a été rejetée.'}</p></div></div></div>)}

            {(kycStatus === null || kycStatus === 'incomplete' || kycStatus === 'rejected') && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Building2 className="w-6 h-6 text-purple-600" />Informations de l'institution</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom de l'institution *</label>
                                <input type="text" name="institutionName" value={formData.institutionName} onChange={handleInputChange} required placeholder="Ex: Université de Kinshasa" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type d'institution *</label>
                                <select name="institutionType" value={formData.institutionType} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600">
                                    {INSTITUTION_TYPES.map(type => (<option key={type.value} value={type.value}>{type.label}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pays *</label>
                                <select name="countryCode" value={formData.countryCode} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600">
                                    {countries.map(country => (<option key={country.code} value={country.code}>{country.name}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email officiel *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="contact@institution.cd" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Téléphone</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+243 XXX XXX XXX" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><FileText className="w-6 h-6 text-purple-600" />Documents (optionnel)</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Les documents peuvent accélérer la validation de votre demande.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[{ key: 'legalDocs', label: 'Documents légaux' }, { key: 'accreditation', label: 'Accréditation' }, { key: 'taxCertificate', label: 'Attestation fiscale' }, { key: 'ministerialDecree', label: 'Arrêté ministériel' }].map((doc) => (
                                <div key={doc.key} className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-400 transition-colors">
                                    <label className="block cursor-pointer">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{doc.label}</span>
                                            {documents[doc.key as keyof typeof documents] && (<CheckCircle className="w-5 h-5 text-green-600" />)}
                                        </div>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange(doc.key as keyof typeof documents)} className="hidden" />
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Upload className="w-4 h-4" />
                                            <span>{documents[doc.key as keyof typeof documents] ? documents[doc.key as keyof typeof documents]!.name : 'Cliquer pour uploader'}</span>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-semibold transition-all shadow-lg disabled:cursor-not-allowed">
                            {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" />Soumission en cours...</>) : (<><Send className="w-5 h-5" />Soumettre la demande</>)}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
