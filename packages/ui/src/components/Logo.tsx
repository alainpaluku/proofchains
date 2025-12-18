/**
 * PROOFCHAIN UI - Logo Component
 * Composant logo réutilisable pour toutes les apps
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ProofchainLogoSVG } from '../assets/ProofchainLogo';

export interface LogoProps {
    /** Sous-titre affiché sous PROOFCHAIN (ex: "Verifier", "Issuer", "Admin") */
    subtitle?: string;
    /** URL de redirection au clic (défaut: "/") */
    href?: string;
    /** Taille du logo */
    size?: 'sm' | 'md' | 'lg';
    /** Afficher uniquement l'icône (mode collapsed) */
    iconOnly?: boolean;
}

export function Logo({ 
    subtitle, 
    href = '/', 
    size = 'md',
    iconOnly = false 
}: LogoProps) {
    const sizeConfig = {
        sm: {
            logoSize: 28,
            subtitle: 'text-sm',
            gap: 'gap-2',
        },
        md: {
            logoSize: 36,
            subtitle: 'text-base',
            gap: 'gap-3',
        },
        lg: {
            logoSize: 48,
            subtitle: 'text-lg',
            gap: 'gap-4',
        },
    };

    const config = sizeConfig[size];

    const content = (
        <>
            <div className="group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
                <ProofchainLogoSVG 
                    size={config.logoSize} 
                    color="#6ecaff"
                />
            </div>
            {!iconOnly && subtitle && (
                <span className={`${config.subtitle} font-semibold text-gray-800 dark:text-white`}>
                    {subtitle}
                </span>
            )}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={`flex items-center ${config.gap} group`}>
                {content}
            </Link>
        );
    }

    return (
        <div className={`flex items-center ${config.gap} group`}>
            {content}
        </div>
    );
}
