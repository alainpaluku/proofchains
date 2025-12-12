/**
 * PROOFCHAIN - Base Service
 * Utilitaires communs pour tous les services Supabase
 */

import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type { ServiceResponse } from '../types';

export type { ServiceResponse };

/**
 * Vérifie si Supabase est configuré
 */
export function checkSupabase<T>(): ServiceResponse<T> | null {
    if (!isSupabaseConfigured()) {
        return { success: false, error: 'Supabase non configuré' };
    }
    return null;
}

/**
 * Gestion d'erreur standardisée
 */
export function handleError<T>(error: unknown, context: string): ServiceResponse<T> {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error(`[${context}]`, error);
    return { success: false, error: message };
}

/**
 * Wrapper pour les opérations Supabase avec gestion d'erreur automatique
 */
export async function withSupabase<T>(
    operation: (supabase: ReturnType<typeof getSupabaseClient>) => Promise<T>,
    context: string
): Promise<ServiceResponse<T>> {
    const configError = checkSupabase<T>();
    if (configError) return configError;

    try {
        const supabase = getSupabaseClient();
        const data = await operation(supabase);
        return { success: true, data };
    } catch (error) {
        return handleError<T>(error, context);
    }
}

/**
 * Compte le nombre d'enregistrements dans une table
 */
export async function countRecords(
    table: string, 
    filter?: { column: string; value: string }
): Promise<number> {
    const supabase = getSupabaseClient();
    let query = supabase.from(table).select('*', { count: 'exact', head: true });
    if (filter) query = query.eq(filter.column, filter.value);
    const { count } = await query;
    return count || 0;
}

/**
 * Récupère l'ID de l'utilisateur connecté
 */
export async function getCurrentUserId(): Promise<string | null> {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
}

/**
 * Récupère l'institution de l'utilisateur connecté
 */
export async function getCurrentInstitutionId(): Promise<string | null> {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
        .from('institutions')
        .select('id')
        .eq('created_by', user.id)
        .single();
    
    return data?.id || null;
}

/**
 * Vérifie si l'utilisateur est admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    return user.user_metadata?.role === 'admin' || 
           user.email?.toLowerCase() === 'alainpaluku@proton.me';
}

export { getSupabaseClient, isSupabaseConfigured };
