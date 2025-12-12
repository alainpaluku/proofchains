'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, AlertCircle, RefreshCw } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScan: (result: string) => void;
}

export default function QRScannerModal({ isOpen, onClose, onScan }: QRScannerModalProps) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const containerId = 'qr-reader';

    const startScanner = async () => {
        setError(null);
        setIsInitializing(true);

        try {
            // Clean up any existing scanner
            if (scannerRef.current) {
                try {
                    await scannerRef.current.stop();
                } catch (e) {
                    // Ignore stop errors
                }
                scannerRef.current = null;
            }

            // Create new scanner instance
            const html5QrCode = new Html5Qrcode(containerId);
            scannerRef.current = html5QrCode;

            // Get available cameras
            const cameras = await Html5Qrcode.getCameras();
            if (cameras.length === 0) {
                throw new Error('NotFoundError');
            }

            // Prefer back camera on mobile
            const backCamera = cameras.find(c => 
                c.label.toLowerCase().includes('back') || 
                c.label.toLowerCase().includes('arrière') ||
                c.label.toLowerCase().includes('environment')
            );
            const cameraId = backCamera?.id || cameras[cameras.length - 1].id;

            await html5QrCode.start(
                cameraId,
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1,
                },
                (decodedText) => {
                    handleScanSuccess(decodedText);
                },
                () => {
                    // QR code not found - ignore
                }
            );

            setIsScanning(true);
        } catch (err: any) {
            console.error('Scanner error:', err);
            if (err.name === 'NotAllowedError' || err.message?.includes('NotAllowedError')) {
                setError('Accès à la caméra refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.');
            } else if (err.name === 'NotFoundError' || err.message === 'NotFoundError') {
                setError('Aucune caméra détectée sur cet appareil.');
            } else {
                setError('Erreur caméra: ' + (err.message || 'Impossible de démarrer le scanner'));
            }
        } finally {
            setIsInitializing(false);
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                if (scannerRef.current.isScanning) {
                    await scannerRef.current.stop();
                }
            } catch (e) {
                // Ignore stop errors
            }
            scannerRef.current = null;
        }
        setIsScanning(false);
    };

    const handleScanSuccess = async (result: string) => {
        // Extract document ID from URL if it's a full URL
        let documentId = result;
        
        // Check if it's a verification URL
        const verifyMatch = result.match(/\/verify\/([^\/\?]+)/);
        if (verifyMatch) {
            documentId = decodeURIComponent(verifyMatch[1]);
        }

        await stopScanner();
        onScan(documentId);
        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                startScanner();
            }, 100);
            return () => clearTimeout(timer);
        } else {
            stopScanner();
        }

        return () => {
            stopScanner();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Camera className="w-5 h-5 text-purple-600" />
                        Scanner QR Code
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                        aria-label="Fermer"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Scanner Area */}
                <div className="relative bg-black" style={{ minHeight: '350px' }}>
                    {error ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                            <p className="text-white mb-4">{error}</p>
                            <button
                                onClick={startScanner}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Réessayer
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* QR Scanner Container */}
                            <div 
                                id={containerId} 
                                className="w-full"
                                style={{ minHeight: '350px' }}
                            />
                            
                            {/* Loading indicator */}
                            {isInitializing && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                                    <p className="text-white text-sm">Initialisation de la caméra...</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800">
                    <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                        {isScanning 
                            ? 'Placez le QR code dans le cadre pour le scanner'
                            : 'Préparation du scanner...'
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}
