'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { updatePassword } from '@proofchain/shared';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) { setError('Mot de passe trop court'); return; }
        if (password !== confirmPassword) { setError('Mots de passe differents'); return; }
        setLoading(true);
        const result = await updatePassword(password);
        if (result.success) { setSuccess(true); setTimeout(() => router.push('/login'), 3000); }
        else { setError(result.error?.message || 'Erreur'); }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mot de passe mis a jour</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full">
                <Lock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">Nouveau mot de passe</h1>
                {error && <div className="mb-4 p-3 bg-red-100 rounded-lg flex gap-2"><AlertCircle className="w-5 h-5 text-red-600" /><span className="text-red-700">{error}</span></div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nouveau mot de passe" className="w-full px-4 py-3 border rounded-xl" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                    </div>
                    <div className="relative">
                        <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmer" className="w-full px-4 py-3 border rounded-xl" required />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3 text-gray-400">{showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}{loading ? 'Mise a jour...' : 'Mettre a jour'}
                    </button>
                </form>
            </div>
        </div>
    );
}
