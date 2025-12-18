'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout as SharedAppLayout, type SidebarItem, Logo } from '@proofchain/ui';
import { useAuth } from '@proofchain/shared';
import { Coins, Users, FileCheck, Settings, CreditCard, Home } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: LayoutProps) {
    const { user, signOut } = useAuth();
    const router = useRouter();
    
    const menuItems: SidebarItem[] = [
        { label: 'Tableau de bord', icon: Home, href: '/' },
        { label: 'Émettre', icon: Coins, href: '/mint' },
        { label: 'Étudiants', icon: Users, href: '/students' },
        { label: 'Validation KYC', icon: FileCheck, href: '/kyc' },
        { label: 'Abonnements', icon: CreditCard, href: '/subscriptions' },
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
            logo={(collapsed) => <Logo subtitle="Issuer" iconOnly={collapsed} />}
            user={user}
            onSignOut={handleSignOut}
            onSettingsClick={handleSettingsClick}
        >
            {children}
        </SharedAppLayout>
    );
}
