import type { Metadata } from 'next';
import './globals.css';
import { AuthWrapper } from '../components/AuthWrapper';
import { ThemeScript } from '@proofchain/ui';

export const metadata: Metadata = {
    title: 'PROOFCHAIN Issuer',
    description: 'Issue academic diplomas as NFTs on Cardano',
    manifest: '/manifest.json',
    themeColor: '#6ecaff',
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'PROOFCHAIN Issuer',
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
                <ThemeScript />
            </head>
            <body className="antialiased">
                <AuthWrapper>
                    {children}
                </AuthWrapper>
            </body>
        </html>
    );
}
