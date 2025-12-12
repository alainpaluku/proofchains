'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CheckCircle, AlertCircle, Info, ArrowLeft, Loader2, FileCheck, Building2, Users } from 'lucide-react';
import { adminService } from '@proofchain/shared';

interface Notification {
    id: string;
    type: 'success' | 'warning' | 'info';
    title: string;
    message: string;
    time: string;
    read: boolean;
}

export default function NotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const notifs: Notification[] = [];

            // Charger les demandes KYC en attente
            const kycResult = await adminService.getPendingKYCRequests();
            if (kycResult.success && kycResult.data) {
                kycResult.data.forEach((req, index) => {
                    notifs.push({
                        id: `kyc-${req.id}`,
                        type: 'warning',
                        title: 'Nouvelle demande KYC',
                        message: `${req.name} (${req.email}) a soumis une demande de vérification KYC.`,
                        time: req.kycSubmittedAt ? new Date(req.kycSubmittedAt).toLocaleString('fr-FR') : 'Récemment',
                        read: index > 1,
                    });
                });
            }

            // Charger les stats pour générer des notifications système
            const statsResult = await adminService.getAdminStats();
            if (statsResult.success && statsResult.data) {
                const stats = statsResult.data;
                
                if (stats.totalInstitutions > 0) {
                    notifs.push({
                        id: 'stats-institutions',
                        type: 'info',
                        title: 'Statistiques plateforme',
                        message: `${stats.totalInstitutions} institution(s) enregistrée(s), ${stats.approvedKYC} approuvée(s), ${stats.totalDocuments} document(s) émis.`,
                        time: new Date().toLocaleString('fr-FR'),
                        read: true,
                    });
                }

                if (stats.pendingKYC > 0) {
                    notifs.unshift({
                        id: 'pending-kyc-alert',
                        type: 'warning',
                        title: 'KYC en attente',
                        message: `${stats.pendingKYC} demande(s) KYC en attente de validation.`,
                        time: 'Maintenant',
                        read: false,
                    });
                }
            }

            // Charger les institutions récentes
            const instResult = await adminService.getAllInstitutions();
            if (instResult.success && instResult.data) {
                const recentInsts = instResult.data.slice(0, 5);
                recentInsts.forEach((inst, index) => {
                    if (inst.kyc_status === 'approved') {
                        notifs.push({
                            id: `inst-approved-${inst.id}`,
                            type: 'success',
                            title: 'Institution approuvée',
                            message: `${inst.name} a été approuvée et peut maintenant émettre des diplômes.`,
                            time: inst.kyc_reviewed_at ? new Date(inst.kyc_reviewed_at).toLocaleString('fr-FR') : 'Récemment',
                            read: true,
                        });
                    }
                });
            }

            setNotifications(notifs);
        } catch (err) {
            console.error('Erreur chargement notifications:', err);
        }
        setLoading(false);
    };

    const unreadCount = notifications.filter(n => !n.read).length;
    
    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };
    
    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type: string, title: string) => {
        if (title.includes('KYC')) return <FileCheck className="w-5 h-5 text-yellow-600" />;
        if (title.includes('Institution')) return <Building2 className="w-5 h-5 text-green-600" />;
        if (title.includes('Statistiques')) return <Users className="w-5 h-5 text-blue-600" />;
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
            default: return <Info className="w-5 h-5 text-blue-600" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.back()} className="p-2 min-w-[44px] min-h-[44px] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors" aria-label="Retour">
                                <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Bell className="w-6 h-6 text-purple-600" />
                                    Notifications Admin
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium px-4 py-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                                Tout marquer comme lu
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {notifications.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">Aucune notification</p>
                        <p className="text-sm text-gray-500 mt-2">Tout est à jour !</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notification) => (
                            <div key={notification.id} onClick={() => markAsRead(notification.id)}
                                className={`bg-white dark:bg-gray-800 rounded-2xl p-5 cursor-pointer transition-all shadow-sm hover:shadow-md ${notification.read ? '' : 'ring-2 ring-purple-200 dark:ring-purple-800'}`}>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">{getIcon(notification.type, notification.title)}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">{notification.title}</h4>
                                            {!notification.read && <span className="w-2.5 h-2.5 bg-purple-600 rounded-full flex-shrink-0 mt-1.5" />}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notification.message}</p>
                                        <p className="text-xs text-gray-500">{notification.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
