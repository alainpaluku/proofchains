import type { Metadata } from 'next';
import './globals.css';
import AppLayout from '../components/AppLayout';
import { Providers } from '../components/Providers';
import { ThemeScript } from '@proofchain/ui';

export const metadata: Metadata = {
    title: 'PROOFCHAIN Verifier - Vérification de diplômes',
    description: 'Vérifiez l\'authenticité des diplômes sur la blockchain Cardano',
    manifest: '/manifest.json',
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
    themeColor: '#6ecaff',
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
            <body className="font-sans">
                <Providers>
                    <AppLayout>
                        {children}
                    </AppLayout>
                </Providers>
            </body>
        </html>
    );
}
