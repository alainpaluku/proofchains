'use client';

import React from 'react';
import { AppLayout as SharedAppLayout, type SidebarItem, Logo } from '@proofchain/ui';
import { Home, Info } from 'lucide-react';
import FloatingScanner from './FloatingScanner';

interface LayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: LayoutProps) {
    const menuItems: SidebarItem[] = [
        { label: 'Accueil', icon: Home, href: '/' },
        { label: 'À propos', icon: Info, href: '/about' },
    ];

    return (
        <>
            <SharedAppLayout 
                menuItems={menuItems} 
                logo={(collapsed) => <Logo subtitle="Verifier" iconOnly={collapsed} />}
                showNotifications={false}
            >
                {children}
            </SharedAppLayout>
            <FloatingScanner />
        </>
    );
}
