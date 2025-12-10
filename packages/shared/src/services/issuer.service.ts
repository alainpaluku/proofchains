/**
 * PROOFCHAIN - Issuer Service
 * Service pour gérer l'institution de l'utilisateur connecté (issuer)
 */

import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type { Institution, InstitutionType } from '../types/database.types';

export interface UpdateInstitutionData {
    name?: string;
    email?: string;
    website?: string;
    phone?: string;
    address?: string;
    taxId?: string;
    registrationNumber?: string;
}

export interface KYCSubmissionData {
    institutionName: string;
    institutionType: InstitutionType;
    countryCode: string;
    email: string;
    website?: string;
    phone?: string;
    address?: string;
    taxId?: string;
    registrationNumber?: string;
    legalDocsUrl?: string;
    accreditationUrl?: string;
    taxCertificateUrl?: string;
    ministerialDecreeUrl?: string;
}

export const issuerService = {
    /**
     * Récupérer l'institution de l'utilisateur connecté
     */
    async getMyInstitution(): Promise<{ success: boolean; institution?: Institution; error?: string }> {
        if (!isSupabaseConfigured()) {
            return { success: false, error: 'Supabase non configuré' };
        }

        try {
            const supabase = getSupabaseClient();
            
            // Récupérer l'utilisateur connecté
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return { success: false, error: 'Utilisateur non connecté' };
            }

            // Récupérer l'institution créée par cet utilisateur
            const { data, error } = await supabase
                .from('institutions')
                .select('*')
                .eq('created_by', user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

            return { success: true, institution: data || undefined };
        } catch (error: any) {
            console.error('Erreur récupération institution:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Créer ou soumettre une demande KYC
     */
    async submitKYC(data: KYCSubmissionData): Promise<{ success: boolean; institution?: Institution; error?: string }> {
        if (!isSupabaseConfigured()) {
            return { success: false, error: 'Supabase non configuré' };
        }

        try {
            const supabase = getSupabaseClient();
            
            // Récupérer l'utilisateur connecté
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return { success: false, error: 'Utilisateur non connecté' };
            }

            // Vérifier si une institution existe déjà
            const { data: existing } = await supabase
                .from('institutions')
                .select('id')
                .eq('created_by', user.id)
                .single();

            if (existing) {
                // Mettre à jour l'institution existante
                const { data: institution, error } = await supabase
                    .from('institutions')
                    .update({
                        name: data.institutionName,
                        type: data.institutionType,
                        country_code: data.countryCode,
                        email: data.email,
                        website: data.website || null,
                        phone: data.phone || null,
                        address: data.address || null,
                        tax_id: data.taxId || null,
                        registration_number: data.registrationNumber || null,
                        legal_docs_url: data.legalDocsUrl || null,
                        accreditation_url: data.accreditationUrl || null,
                        tax_certificate_url: data.taxCertificateUrl || null,
                        ministerial_decree_url: data.ministerialDecreeUrl || null,
                        kyc_status: 'pending',
                        kyc_submitted_at: new Date().toISOString(),
                    })
                    .eq('id', existing.id)
                    .select()
                    .single();

                if (error) throw error;
                return { success: true, institution };
            } else {
                // Créer une nouvelle institution
                const { data: institution, error } = await supabase
                    .from('institutions')
                    .insert({
                        name: data.institutionName,
                        type: data.institutionType,
                        country_code: data.countryCode,
                        email: data.email,
                        website: data.website || null,
                        phone: data.phone || null,
                        address: data.address || null,
                        tax_id: data.taxId || null,
                        registration_number: data.registrationNumber || null,
                        legal_docs_url: data.legalDocsUrl || null,
                        accreditation_url: data.accreditationUrl || null,
                        tax_certificate_url: data.taxCertificateUrl || null,
                        ministerial_decree_url: data.ministerialDecreeUrl || null,
                        kyc_status: 'pending',
                        kyc_submitted_at: new Date().toISOString(),
                        created_by: user.id,
                        institution_code: '', // Auto-généré par trigger
                    })
                    .select()
                    .single();

                if (error) throw error;
                return { success: true, institution };
            }
        } catch (error: any) {
            console.error('Erreur soumission KYC:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Mettre à jour les informations de l'institution
     */
    async updateInstitution(data: UpdateInstitutionData): Promise<{ success: boolean; institution?: Institution; error?: string }> {
        if (!isSupabaseConfigured()) {
            return { success: false, error: 'Supabase non configuré' };
        }

        try {
            const supabase = getSupabaseClient();
            
            // Récupérer l'utilisateur connecté
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return { success: false, error: 'Utilisateur non connecté' };
            }

            const updateData: any = {};
            if (data.name) updateData.name = data.name;
            if (data.email) updateData.email = data.email;
            if (data.website !== undefined) updateData.website = data.website;
            if (data.phone !== undefined) updateData.phone = data.phone;
            if (data.address !== undefined) updateData.address = data.address;
            if (data.taxId !== undefined) updateData.tax_id = data.taxId;
            if (data.registrationNumber !== undefined) updateData.registration_number = data.registrationNumber;

            const { data: institution, error } = await supabase
                .from('institutions')
                .update(updateData)
                .eq('created_by', user.id)
                .select()
                .single();

            if (error) throw error;

            return { success: true, institution };
        } catch (error: any) {
            console.error('Erreur mise à jour institution:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Récupérer les statistiques du dashboard
     */
    async getDashboardStats(): Promise<{ 
        success: boolean; 
        stats?: {
            documentsIssued: number;
            studentsCount: number;
            documentsVerified: number;
            documentsPending: number;
        }; 
        error?: string 
    }> {
        if (!isSupabaseConfigured()) {
            return { success: false, error: 'Supabase non configuré' };
        }

        try {
            const supabase = getSupabaseClient();
            
            // Récupérer l'utilisateur connecté
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return { success: false, error: 'Utilisateur non connecté' };
            }

            // Récupérer l'institution
            const { data: institution } = await supabase
                .from('institutions')
                .select('id, documents_issued, students_count')
                .eq('created_by', user.id)
                .single();

            if (!institution) {
                return { 
                    success: true, 
                    stats: { documentsIssued: 0, studentsCount: 0, documentsVerified: 0, documentsPending: 0 } 
                };
            }

            // Récupérer les stats des documents
            const { data: documents } = await supabase
                .from('documents')
                .select('status')
                .eq('institution_id', institution.id);

            const issued = documents?.filter((d: { status: string }) => d.status === 'issued').length || 0;
            const pending = documents?.filter((d: { status: string }) => d.status === 'draft').length || 0;

            // Récupérer le nombre de vérifications
            const { count: verificationsCount } = await supabase
                .from('verification_logs')
                .select('id', { count: 'exact', head: true })
                .in('document_id', documents?.map((d: { status: string }) => d.status === 'issued') || []);

            return { 
                success: true, 
                stats: {
                    documentsIssued: issued,
                    studentsCount: institution.students_count || 0,
                    documentsVerified: verificationsCount || 0,
                    documentsPending: pending,
                }
            };
        } catch (error: any) {
            console.error('Erreur récupération stats:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Récupérer l'activité récente
     */
    async getRecentActivity(limit: number = 10): Promise<{ 
        success: boolean; 
        activities?: Array<{
            id: string;
            type: 'document_issued' | 'student_added' | 'verification';
            description: string;
            createdAt: string;
        }>; 
        error?: string 
    }> {
        if (!isSupabaseConfigured()) {
            return { success: false, error: 'Supabase non configuré' };
        }

        try {
            const supabase = getSupabaseClient();
            
            // Récupérer l'utilisateur connecté
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return { success: false, error: 'Utilisateur non connecté' };
            }

            // Récupérer l'institution
            const { data: institution } = await supabase
                .from('institutions')
                .select('id')
                .eq('created_by', user.id)
                .single();

            if (!institution) {
                return { success: true, activities: [] };
            }

            // Récupérer les derniers documents émis
            const { data: documents } = await supabase
                .from('documents')
                .select(`
                    id,
                    created_at,
                    status,
                    student:students(full_name)
                `)
                .eq('institution_id', institution.id)
                .order('created_at', { ascending: false })
                .limit(limit);

            const activities = documents?.map((doc: { id: string; status: string; student: { full_name: string } | null; created_at: string | null }) => ({
                id: doc.id,
                type: 'document_issued' as const,
                description: `Document ${doc.status === 'issued' ? 'émis' : 'créé'} pour ${doc.student?.full_name || 'Étudiant'}`,
                createdAt: doc.created_at || new Date().toISOString(),
            })) || [];

            return { success: true, activities };
        } catch (error: any) {
            console.error('Erreur récupération activité:', error);
            return { success: false, error: error.message };
        }
    },
};
