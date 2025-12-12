/**
 * PROOFCHAIN - Authentication par Email/Mot de passe via Supabase
 */

import { getSupabaseClient, isSupabaseConfigured } from './supabase';

export type AuthUser = {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    role?: 'admin' | 'issuer' | 'verifier';
};

// Email admin autorisé (hardcoded pour sécurité)
export const ADMIN_EMAIL = 'alainpaluku@proton.me';

/**
 * Vérifie si un email est admin
 */
export function isAdminEmail(email: string): boolean {
    return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export type AuthError = {
    message: string;
    code?: string;
};

/**
 * Inscription avec email et mot de passe
 */
export async function signUp(email: string, password: string, name?: string): Promise<{ success: boolean; error?: AuthError }> {
    if (!isSupabaseConfigured()) {
        return { success: false, error: { message: 'Supabase non configuré' } };
    }

    // Determine redirect URL based on environment
    const redirectUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_ISSUER_URL || 'https://proofchain-issuer.vercel.app';

    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
            },
            emailRedirectTo: redirectUrl,
        },
    });

    if (error) {
        return { 
            success: false, 
            error: { 
                message: getErrorMessage(error.message),
                code: error.message 
            } 
        };
    }

    return { success: true };
}

/**
 * Connexion avec email et mot de passe
 */
export async function signInWithEmail(email: string, password: string): Promise<{ success: boolean; error?: AuthError }> {
    if (!isSupabaseConfigured()) {
        return { success: false, error: { message: 'Supabase non configuré' } };
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { 
            success: false, 
            error: { 
                message: getErrorMessage(error.message),
                code: error.message 
            } 
        };
    }

    return { success: true };
}

/**
 * Réinitialisation du mot de passe
 */
export async function resetPassword(email: string): Promise<{ success: boolean; error?: AuthError }> {
    if (!isSupabaseConfigured()) {
        return { success: false, error: { message: 'Supabase non configuré' } };
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
        return { 
            success: false, 
            error: { 
                message: getErrorMessage(error.message),
                code: error.message 
            } 
        };
    }

    return { success: true };
}

/**
 * Mise à jour du mot de passe
 */
export async function updatePassword(newPassword: string): Promise<{ success: boolean; error?: AuthError }> {
    if (!isSupabaseConfigured()) {
        return { success: false, error: { message: 'Supabase non configuré' } };
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error) {
        return { 
            success: false, 
            error: { 
                message: getErrorMessage(error.message),
                code: error.message 
            } 
        };
    }

    return { success: true };
}

/**
 * Traduction des messages d'erreur Supabase
 */
function getErrorMessage(code: string): string {
    const messages: Record<string, string> = {
        'Invalid login credentials': 'Email ou mot de passe incorrect',
        'Email not confirmed': 'Veuillez confirmer votre email avant de vous connecter',
        'User already registered': 'Un compte existe déjà avec cet email',
        'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères',
        'Unable to validate email address: invalid format': 'Format d\'email invalide',
        'Email rate limit exceeded': 'Trop de tentatives, veuillez réessayer plus tard',
    };
    return messages[code] || code;
}

/**
 * Déconnexion
 */
export async function signOut() {
    if (!isSupabaseConfigured()) return;

    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

/**
 * Obtenir l'utilisateur courant
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
    if (!isSupabaseConfigured()) return null;

    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const email = user.email || '';
    
    return {
        id: user.id,
        email,
        name: user.user_metadata?.full_name || user.user_metadata?.name,
        avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        role: isAdminEmail(email) ? 'admin' : 'issuer',
    };
}

/**
 * Écouter les changements d'auth
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
    if (!isSupabaseConfigured()) return () => {};

    const supabase = getSupabaseClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
            const email = session.user.email || '';
            callback({
                id: session.user.id,
                email,
                name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
                role: isAdminEmail(email) ? 'admin' : 'issuer',
            });
        } else {
            callback(null);
        }
    });

    return () => subscription.unsubscribe();
}
