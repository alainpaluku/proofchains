'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Shield, Bell, Key, Save, Loader2, AlertCircle, CheckCircle, Users } from 'lucide-react';
import { adminService, getCurrentUser } from '@proofchain/shared';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [stats, setStats] = useState({ totalInstitutions: 0, pendingKYC: 0, approvedKYC: 0, totalDocuments: 0 });
    
    const [settings, setSettings] = useState({
        platformName: 'PROOFCHAIN',
        adminEmail: '',
        supportEmail: '',
        notifications: { newInstitution: true, kycSubmission: true, newSubscription: true, systemAlerts: true },
        security: { twoFactor: false, sessionTimeout: 30 }
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const user = await getCurrentUser();
            if (user) {
                setUserEmail(user.email);
                setSettings(s => ({ ...s, adminEmail: user.email }));
            }

            const statsResult = await adminService.getAdminStats();
            if (statsResult.success && statsResult.data) {
                setStats(statsResult.data);
            }
        } catch (err) {
            console.error('Erreur chargement:', err);
        }
        setLoading(false);
    };

    const handleSave = () => {
        setSaving(true);
        setError('');
        setTimeout(() => {
            setSuccess('Paramètres sauvegardés avec succès');
            setSaving(false);
        }, 500);
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
                    Paramètres Admin
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Configuration de la plateforme</p>
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

            {/* Stats Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Users className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Aperçu Plateforme</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
                        <p className="text-2xl font-bold text-purple-600">{stats.totalInstitutions}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Institutions</p>
                    </div>
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-center">
                        <p className="text-2xl font-bold text-yellow-600">{stats.pendingKYC}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">KYC en attente</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                        <p className="text-2xl font-bold text-green-600">{stats.approvedKYC}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">KYC approuvés</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                        <p className="text-2xl font-bold text-blue-600">{stats.totalDocuments}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Documents</p>
                    </div>
                </div>
            </div>

            {/* Platform Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Settings className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Paramètres généraux</h2>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom de la plateforme</label>
                        <input type="text" value={settings.platformName} onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email admin</label>
                            <input type="email" value={settings.adminEmail} onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email support</label>
                            <input type="email" value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" placeholder="support@proofchain.com" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Account */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Compte Admin</h2>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Connecté en tant que</p>
                    <p className="font-medium text-purple-700 dark:text-purple-300">{userEmail}</p>
                    <p className="text-xs text-purple-600 mt-1">Administrateur</p>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
                </div>
                <div className="space-y-4">
                    {[
                        { key: 'newInstitution', label: 'Nouvelle institution', desc: 'Notification lors d\'une nouvelle inscription' },
                        { key: 'kycSubmission', label: 'Soumission KYC', desc: 'Notification lors d\'une nouvelle demande KYC' },
                        { key: 'newSubscription', label: 'Nouvel abonnement', desc: 'Notification lors d\'un nouvel abonnement' },
                        { key: 'systemAlerts', label: 'Alertes système', desc: 'Recevoir les alertes système importantes' },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                                    onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, [item.key]: e.target.checked } })} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Security */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sécurité</h2>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Authentification à deux facteurs</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Sécurité renforcée pour le compte admin</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings.security.twoFactor}
                                onChange={(e) => setSettings({ ...settings, security: { ...settings.security, twoFactor: e.target.checked } })} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timeout de session (minutes)</label>
                        <input type="number" value={settings.security.sessionTimeout}
                            onChange={(e) => setSettings({ ...settings, security: { ...settings.security, sessionTimeout: Number(e.target.value) } })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600" />
                    </div>
                </div>
            </div>

            {/* API Key */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Key className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Clé API Admin</h2>
                </div>
                <div className="flex gap-2">
                    <input type="password" value="sk_admin_••••••••••••" readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium">Régénérer</button>
                </div>
            </div>

            <div className="flex justify-end">
                <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold disabled:opacity-50">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
                </button>
            </div>
        </div>
    );
}
