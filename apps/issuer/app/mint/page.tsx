'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Upload,
    Coins,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ExternalLink,
    Users,
    Download,
    QrCode
} from 'lucide-react';
import { useWallet, ConnectWalletButton } from '@proofchain/ui';
import { 
    documentService, 
    studentService, 
    issuerService,
    type Student 
} from '@proofchain/shared';
import QRCode from 'qrcode';

// Types imported dynamically
type MintingResult = {
    success: boolean;
    txHash?: string;
    assetId?: string;
    policyId?: string;
    error?: string;
};

type IPFSResult = {
    success: boolean;
    ipfsHash?: string;
    url?: string;
    error?: string;
};

// URL de base pour la vérification
const LANDING_URL = process.env.NEXT_PUBLIC_LANDING_URL || 'https://proofchains.org';

export default function MintPage() {
    const { walletApi, connected } = useWallet();
    const dataLoadedRef = useRef(false);

    const [institutionId, setInstitutionId] = useState<string | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(true);

    const [formData, setFormData] = useState({
        studentId: '',
        degreeType: '',
        fieldOfStudy: '',
        graduationDate: '',
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [mintResult, setMintResult] = useState<MintingResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [documentId, setDocumentId] = useState<string | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

    const generateQRCode = useCallback(async (docId: string) => {
        const verifyUrl = `${LANDING_URL}/verify/${docId}`;
        try {
            const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
                width: 256,
                margin: 2,
                color: { dark: '#7c3aed', light: '#ffffff' }
            });
            setQrCodeUrl(qrDataUrl);
        } catch (err) {
            console.error('Erreur génération QR:', err);
        }
    }, []);

    useEffect(() => {
        if (documentId && mintResult?.success) {
            generateQRCode(documentId);
        }
    }, [documentId, mintResult?.success, generateQRCode]);

    // Charger les données de l'institution et des étudiants
    const loadData = useCallback(async () => {
        setLoadingStudents(true);
        setError(null);
        try {
            const instResult = await issuerService.getMyInstitution();
            if (instResult.success && instResult.data) {
                setInstitutionId(instResult.data.id);
                
                if (instResult.data.kyc_status !== 'approved') {
                    setError('⚠️ Votre institution doit être validée (KYC approuvé) pour émettre des diplômes.');
                    setLoadingStudents(false);
                    return;
                }

                const studentsResult = await studentService.getByInstitution(instResult.data.id);
                if (studentsResult.success && studentsResult.data) {
                    setStudents(studentsResult.data);
                }
            } else {
                setError('⚠️ Vous devez d\'abord créer votre institution et compléter le KYC.');
            }
        } catch (err) {
            console.error('Erreur chargement données:', err);
            setError('Erreur lors du chargement des données.');
        }
        setLoadingStudents(false);
        dataLoadedRef.current = true;
    }, []);

    // Charger les données au montage
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Recharger les données quand le wallet se connecte (résout le problème de rafraîchissement)
    useEffect(() => {
        if (connected && dataLoadedRef.current) {
            // Petit délai pour laisser le wallet s'initialiser complètement
            const timer = setTimeout(() => {
                loadData();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [connected, loadData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setImageFile(null);
            setImagePreview(null);
            return;
        }

        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setError('⚠️ Seuls les fichiers PNG et JPG sont acceptés.');
            e.target.value = '';
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError('⚠️ L\'image est trop volumineuse (max 10 MB).');
            e.target.value = '';
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setError(null);
    };

    const handleMint = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!connected || !walletApi) {
            setError('⚠️ Veuillez connecter votre wallet');
            return;
        }

        if (!institutionId) {
            setError('⚠️ Institution non trouvée');
            return;
        }

        if (!formData.studentId || !formData.degreeType || !formData.fieldOfStudy || !formData.graduationDate) {
            setError('⚠️ Veuillez remplir tous les champs obligatoires');
            return;
        }

        if (!imageFile) {
            setError('⚠️ Veuillez uploader une image du diplôme');
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            // Dynamic import of chain functions
            const { mintDiplomaNFT, uploadToIPFS } = await import('@proofchain/chain');

            console.log('📤 Upload image sur IPFS...');
            const imageUpload: IPFSResult = await uploadToIPFS(imageFile);
            if (!imageUpload.success || !imageUpload.ipfsHash) {
                throw new Error(imageUpload.error || 'Échec upload IPFS');
            }

            console.log('📝 Création document dans Supabase...');
            const docResult = await documentService.create(institutionId, {
                studentId: formData.studentId,
                degreeType: formData.degreeType,
                fieldOfStudy: formData.fieldOfStudy,
                issueDate: new Date().toISOString().split('T')[0],
                graduationDate: formData.graduationDate,
                ipfsHash: imageUpload.ipfsHash,
                ipfsUrl: imageUpload.url,
            });

            if (!docResult.success || !docResult.data) {
                throw new Error(docResult.error || 'Échec création document');
            }

            const document = docResult.data;
            setDocumentId(document.document_id);

            setIsUploading(false);
            setIsMinting(true);

            const verifyUrl = `${LANDING_URL}/verify/${document.document_id}`;
            
            const metadata = {
                name: `PROOFCHAIN Diploma - ${document.document_id}`,
                image: imageUpload.url!,
                mediaType: imageFile.type === 'image/png' ? 'image/png' : 'image/jpeg',
                description: `Academic credential verified by PROOFCHAIN. Verify at: ${verifyUrl}`,
                attributes: {
                    documentId: document.document_id,
                    platform: 'PROOFCHAIN',
                    version: '2.0',
                    verifyUrl: verifyUrl,
                },
                version: '2.0',
                standard: 'CIP-25' as const,
            };

            console.log('⛏️ Minting NFT sur Cardano...');
            const assetName = `PCD${document.document_code}`;

            const result: MintingResult = await mintDiplomaNFT(walletApi, { metadata, assetName });

            if (result.success && result.txHash && result.assetId) {
                console.log('✅ Mise à jour document dans Supabase...');
                await documentService.updateAfterMint(document.id, {
                    txHash: result.txHash,
                    assetId: result.assetId,
                    policyId: result.policyId || '',
                    assetName: assetName,
                });

                setMintResult(result);
                setFormData({ studentId: '', degreeType: '', fieldOfStudy: '', graduationDate: '' });
                setImageFile(null);
                setImagePreview(null);
            } else {
                setError(result.error || 'Échec du minting');
            }
        } catch (err: any) {
            console.error('❌ Erreur:', err);
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setIsUploading(false);
            setIsMinting(false);
        }
    };

    const explorerUrl = process.env.NEXT_PUBLIC_CARDANO_EXPLORER || 'https://preprod.cardanoscan.io';
    const selectedStudent = students.find(s => s.id === formData.studentId);

    return (
        <div className="p-6 space-y-8 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Émettre un diplôme
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Créez un nouveau diplôme NFT sur la blockchain
                    </p>
                </div>
                <ConnectWalletButton showBalance={true} />
            </div>

            {mintResult?.success && (
                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <CheckCircle2 className="w-10 h-10 text-green-600 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
                                ✅ Diplôme émis avec succès !
                            </h3>
                            <p className="text-green-600 dark:text-green-500 mb-4">
                                Le diplôme NFT a été créé sur la blockchain Cardano.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3 bg-white dark:bg-gray-800 rounded-lg p-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Document ID (pour vérification):
                                        </p>
                                        <code className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded font-mono text-sm block break-all">
                                            {documentId}
                                        </code>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Transaction Hash:
                                        </p>
                                        <a
                                            href={`${explorerUrl}/transaction/${mintResult.txHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-600 hover:text-purple-700 font-mono text-sm flex items-center gap-2"
                                        >
                                            {mintResult.txHash?.substring(0, 20)}...
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>

                                {qrCodeUrl && (
                                    <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg p-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                                            <QrCode className="w-4 h-4" />
                                            QR Code de vérification
                                        </p>
                                        <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40 rounded-lg" />
                                        <a
                                            href={qrCodeUrl}
                                            download={`diploma-qr-${documentId}.png`}
                                            className="mt-3 flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
                                        >
                                            <Download className="w-4 h-4" />
                                            Télécharger QR
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex flex-wrap gap-3">
                                <a
                                href={`${LANDING_URL}/verify/${documentId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                            >
                                Vérifier le Document
                            </a>
                                <button
                                    onClick={() => { setMintResult(null); setQrCodeUrl(null); }}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium"
                                >
                                    Émettre un autre diplôme
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-red-700 dark:text-red-400 whitespace-pre-line">{error}</p>
                    </div>
                </div>
            )}

            {!mintResult?.success && (
                <form onSubmit={handleMint} className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Users className="w-6 h-6 text-purple-600" />
                            Nom de l&apos;étudiant
                        </h2>

                        {loadingStudents ? (
                            <div className="flex items-center gap-2 text-gray-500">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Chargement des étudiants...
                            </div>
                        ) : students.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Aucun étudiant enregistré
                                </p>
                                <a href="/students" className="text-purple-600 hover:text-purple-700 font-medium">
                                    Ajouter des étudiants →
                                </a>
                            </div>
                        ) : (
                            <div>
                                <select
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600"
                                >
                                    <option value="">Sélectionner un étudiant</option>
                                    {students.map(student => (
                                        <option key={student.id} value={student.id}>
                                            {student.full_name} - {student.student_number}
                                        </option>
                                    ))}
                                </select>

                                {selectedStudent && (
                                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {selectedStudent.full_name}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Matricule: {selectedStudent.student_number}
                                        </p>
                                        {selectedStudent.program && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Programme: {selectedStudent.program}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Type de diplôme
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Type de diplôme *
                                </label>
                                <select
                                    name="degreeType"
                                    value={formData.degreeType}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600"
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="Licence">Licence</option>
                                    <option value="Master">Master</option>
                                    <option value="Doctorat">Doctorat</option>
                                    <option value="Diplôme">Diplôme</option>
                                    <option value="Certificat">Certificat</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Domaine d&apos;études *
                                </label>
                                <input
                                    type="text"
                                    name="fieldOfStudy"
                                    value={formData.fieldOfStudy}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ex: Informatique"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Date de graduation *
                                </label>
                                <input
                                    type="date"
                                    name="graduationDate"
                                    value={formData.graduationDate}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Image du diplôme
                        </h2>

                        <div>
                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg"
                                onChange={handleFileChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className={`flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                                    imageFile
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-600'
                                }`}
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Aperçu" className="max-h-48 rounded-lg mb-2" />
                                ) : (
                                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                )}
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {imageFile ? imageFile.name : 'Cliquer pour uploader (PNG ou JPG, max 10 MB)'}
                                </span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isUploading || isMinting || !connected || loadingStudents}
                        className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-semibold text-lg transition-all shadow-lg disabled:cursor-not-allowed"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Upload en cours...
                            </>
                        ) : isMinting ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Minting en cours...
                            </>
                        ) : (
                            <>
                                <Coins className="w-6 h-6" />
                                Émettre le diplôme
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}
