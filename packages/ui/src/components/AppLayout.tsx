'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Menu, ChevronLeft } from 'lucide-react';
import { Sidebar, type SidebarItem } from './Sidebar';
import { NotificationButton } from './NotificationButton';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

export interface AppLayoutProps {
    children: React.ReactNode;
    menuItems: SidebarItem[];
    logo: React.ReactNode | ((collapsed: boolean) => React.ReactNode);
    additionalHeaderContent?: React.ReactNode;
    showSidebarToggle?: boolean;
    initialSidebarCollapsed?: boolean;
    onSidebarToggle?: (collapsed: boolean) => void;
    user?: {
        email: string;
        name?: string;
        avatar?: string;
    } | null;
    onSignOut?: () => void;
    onSettingsClick?: () => void;
    showNotifications?: boolean;
}

export function AppLayout({ 
    children, 
    menuItems, 
    logo,
    additionalHeaderContent,
    showSidebarToggle = true,
    initialSidebarCollapsed = false,
    onSidebarToggle,
    user,
    onSignOut,
    onSettingsClick,
    showNotifications = true
}: AppLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(initialSidebarCollapsed);

    useEffect(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState !== null) {
            setIsSidebarCollapsed(savedState === 'true');
        }
    }, []);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
    }, []);

    const toggleSidebar = useCallback(() => {
        setIsSidebarCollapsed(prev => {
            const newState = !prev;
            localStorage.setItem('sidebarCollapsed', String(newState));
            onSidebarToggle?.(newState);
            return newState;
        });
    }, [onSidebarToggle]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] flex">
            <div 
                className={`hidden md:block transition-all duration-300 ${
                    isSidebarCollapsed ? 'w-20' : 'w-64'
                }`}
            >
                <Sidebar 
                    items={menuItems} 
                    logo={typeof logo === 'function' ? logo(isSidebarCollapsed) : logo}
                    collapsed={isSidebarCollapsed}
                />
            </div>

            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={closeMobileMenu}
                        aria-hidden="true"
                    />
                    <div className="fixed inset-y-0 left-0 z-50 md:hidden">
                        <Sidebar 
                            items={menuItems} 
                            logo={typeof logo === 'function' ? logo(false) : logo}
                            onClose={closeMobileMenu}
                        />
                    </div>
                </>
            )}

            <div className="flex-1 flex flex-col min-w-0">
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
                    <div className="px-4 md:px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleMobileMenu}
                                className="md:hidden p-2 min-w-[44px] min-h-[44px] rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                                aria-expanded={isMobileMenuOpen}
                            >
                                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            </button>

                            {showSidebarToggle && (
                                <button
                                    onClick={toggleSidebar}
                                    className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200 group"
                                    aria-label={isSidebarCollapsed ? 'Ouvrir la sidebar' : 'Fermer la sidebar'}
                                    title={isSidebarCollapsed ? 'Ouvrir la sidebar' : 'Fermer la sidebar'}
                                >
                                    <div className={`transition-transform duration-200 ${isSidebarCollapsed ? 'rotate-180' : ''}`}>
                                        <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                                    </div>
                                </button>
                            )}

                            {additionalHeaderContent}
                        </div>

                        <div className="flex items-center gap-2 md:gap-3">
                            <ThemeToggle />
                            {showNotifications && <NotificationButton />}
                            {user && onSignOut && (
                                <UserMenu 
                                    user={user} 
                                    onSignOut={onSignOut}
                                    onSettingsClick={onSettingsClick}
                                />
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
