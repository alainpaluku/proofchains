/**
 * PROOFCHAIN - Sidebar Navigation Component
 * Reusable sidebar for all applications with collapse support
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

export interface SidebarItem {
    label: string;
    href: string;
    icon: LucideIcon;
    badge?: string | number;
}

interface SidebarProps {
    items: SidebarItem[];
    logo?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    collapsed?: boolean;
    onClose?: () => void;
}

export function Sidebar({ 
    items, 
    logo, 
    footer, 
    className = '',
    collapsed = false,
    onClose
}: SidebarProps) {
    const pathname = usePathname();

    const handleLinkClick = () => {
        // Close mobile menu when a link is clicked
        onClose?.();
    };

    return (
        <aside
            className={`
                ${collapsed ? 'w-20' : 'w-64'} 
                h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
                flex flex-col fixed left-0 top-0 z-40 transition-all duration-300
                ${className}
            `}
        >
            {/* Logo */}
            {logo && (
                <div className={`
                    ${collapsed ? 'p-4' : 'p-6'} 
                    border-b border-gray-200 dark:border-gray-800 
                    transition-all duration-300
                    ${collapsed ? 'flex justify-center' : ''}
                `}>
                    {logo}
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {items.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={handleLinkClick}
                            className={`
                                flex items-center ${collapsed ? 'justify-center' : 'gap-3'} 
                                px-4 py-3 rounded-lg transition-all
                                ${isActive
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }
                            `}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!collapsed && (
                                <>
                                    <span className="flex-1">{item.label}</span>
                                    {item.badge && (
                                        <span className="px-2 py-0.5 text-xs font-semibold bg-purple-600 text-white rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            {footer && !collapsed && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    {footer}
                </div>
            )}
        </aside>
    );
}
