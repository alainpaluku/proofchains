'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout as SharedAppLayout, type SidebarItem, Logo } from '@proofchain/ui';
import { useAuth } from '@proofchain/shared';
import { Home, Building2, CreditCard, FileCheck, Settings, BarChart3 } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: LayoutProps) {
    const { user, signOut } = useAuth();
    const router = useRouter();
    
    const menuItems: SidebarItem[] = [
        { label: 'Dashboard', icon: Home, href: '/' },
        { label: 'Institutions', icon: Building2, href: '/institutions' },
        { label: 'Validation KYC', icon: FileCheck, href: '/kyc-validation' },
        { label: 'Abonnements', icon: CreditCard, href: '/subscriptions' },
        { label: 'Statistiques', icon: BarChart3, href: '/statistics' },
        { label: 'Paramètres', icon: Settings, href: '/settings' },
    ];

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    const handleSettingsClick = () => {
        router.push('/settings');
    };

    return (
        <SharedAppLayout 
            menuItems={menuItems} 
            logo={(collapsed) => <Logo subtitle="Admin" iconOnly={collapsed} />}
            user={user}
            onSignOut={handleSignOut}
            onSettingsClick={handleSettingsClick}
        >
            {children}
        </SharedAppLayout>
    );
}
