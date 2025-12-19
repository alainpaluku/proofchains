'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('verificationHistory');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push('/verify/' + encodeURIComponent(query.trim()));
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '20px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
                    PROOFCHAIN Verifier
                </h1>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
                    Verifiez l authenticite d un diplome
                </p>
                
                <form onSubmit={handleSubmit} style={{ marginBottom: '40px' }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Entrez le Document ID"
                        style={{
                            width: '100%',
                            padding: '15px',
                            fontSize: '16px',
                            border: '2px solid #ddd',
                            borderRadius: '10px',
                            marginBottom: '10px'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!query.trim()}
                        style={{
                            width: '100%',
                            padding: '15px',
                            fontSize: '16px',
                            backgroundColor: query.trim() ? '#10b981' : '#ccc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: query.trim() ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Verifier
                    </button>
                </form>

                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
                    Historique
                </h2>
                {history.length === 0 ? (
                    <p style={{ color: '#999', textAlign: 'center' }}>Aucune verification</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {history.map((item: any) => (
                            <li
                                key={item.id}
                                onClick={() => router.push('/verify/' + encodeURIComponent(item.assetId))}
                                style={{
                                    padding: '15px',
                                    backgroundColor: 'white',
                                    borderRadius: '10px',
                                    marginBottom: '10px',
                                    cursor: 'pointer',
                                    border: '1px solid #eee'
                                }}
                            >
                                <strong>{item.diplomaName || 'Diplome'}</strong>
                                <br />
                                <span style={{ color: item.valid ? 'green' : 'red' }}>
                                    {item.valid ? 'Valide' : 'Invalide'}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
