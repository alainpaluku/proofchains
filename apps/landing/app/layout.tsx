import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'PROOFCHAIN - Vérification de Diplômes sur Blockchain',
    description: 'Plateforme de certification académique sur la blockchain Cardano. Émettez, vérifiez et sécurisez vos diplômes avec la technologie NFT.',
    keywords: ['blockchain', 'cardano', 'diplôme', 'certification', 'NFT', 'vérification', 'académique'],
    themeColor: '#7c3aed',
    viewport: {
        width: 'device-width',
        initialScale: 1,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
