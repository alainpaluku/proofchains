'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Building2, Bell, Shield, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { issuerService, getCurrentUser, type Institution } from '@proofchain/shared';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [institution, setInstitution] = useState<Institution | null>(null);
    const [userEmail, setUserEmail] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        taxId: '',
        registrationNumber: '',
    });

    const [notifications, setNotifications] = useState({
        email: true,
        diploma: true,
        kyc: true,
        system: false
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const user = await getCurrentUser();
            if (user) setUserEmail(user.email);

            const result = await issuerService.getMyInstitution();
            if (result.success && result.data) {
                setInstitution(result.data);
                setFormData({
                    name: result.data.name || '',
                    email: result.data.email || '',
                    phone: result.data.phone || '',
                    website: result.data.website || '',
                    address: result.data.address || '',
                    taxId: result.data.tax_id || '',
                    registrationNumber: result.data.registration_number || '',
                });
            }
        } catch (err) {
            console.error('Erreur chargement:', err);
            setError('Erreur lors du chargement des données');
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const result = await issuerService.updateInstitution({
                name: formData.name,
                email: formData.email,
                phone: formData.phone || undefined,
                website: formData.website || undefined,
                address: formData.address || undefined,
                taxId: formData.taxId || undefined,
                registrationNumber: formData.registrationNumber || undefined,
            });

            if (result.success) {
                setSuccess('Paramètres sauvegardés avec succès');
                setInstitution(result.data || null);
            } else {
                setError(result.error || 'Erreur lors de la sauvegarde');
            }
        } catch (err) {
            setError('Erreur lors de la sauvegarde');
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Settings className="w-8 h-8 text-purple-600" />
                    Paramètres
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Configurez votre institution</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700 dark:text-red-400">{error}</p>
                </div>
            )}

            {success && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-700 dark:text-green-400">{success}</p>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Building2 className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Institution</h2>
                </div>

                {institution && (
                    <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                            Code: <span className="font-mono font-bold">{institution.institution_code}</span> | 
                            KYC: <span className={institution.kyc_status === 'approved' ? 'text-green-600' : 'text-yellow-600'}>
                                {institution.kyc_status === 'approved' ? 'Approuvé' : institution.kyc_status === 'pending' ? 'En attente' : 'Incomplet'}
                            </span>
                        </p>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Téléphone</label>
                            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site web</label>
                        <input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" placeholder="https://" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Adresse</label>
                        <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={2}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Compte</h2>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email du compte</p>
                    <p className="font-medium text-gray-900 dark:text-white">{userEmail || 'Non connecté'}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
                </div>
                <div className="space-y-4">
                    {[
                        { key: 'email', label: 'Notifications par email' },
                        { key: 'diploma', label: 'Émission de diplômes' },
                        { key: 'kyc', label: 'Validation KYC' },
                        { key: 'system', label: 'Mises à jour système' },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={notifications[item.key as keyof typeof notifications]}
                                    onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>



            <div className="flex justify-end">
                <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold disabled:opacity-50">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
            </div>
        </div>
    );
}
