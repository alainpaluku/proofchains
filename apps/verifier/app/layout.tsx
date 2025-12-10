import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppLayout from '../components/AppLayout';
import { Providers } from '../components/Providers';
import { ThemeScript } from '@proofchain/ui';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'PROOFCHAIN Verifier - Vérification de diplômes',
    description: 'Vérifiez l\'authenticité des diplômes sur la blockchain Cardano',
    manifest: '/manifest.json',
    themeColor: '#6ecaff',
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'PROOFCHAIN',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/icons/icon-192x192.png" />
                <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <ThemeScript />
            </head>
            <body className={inter.className}>
                <Providers>
                    <AppLayout>
                        {children}
                    </AppLayout>
                </Providers>
            </body>
        </html>
    );
}
