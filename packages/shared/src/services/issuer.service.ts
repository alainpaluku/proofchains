/**
 * PROOFCHAIN - Issuer Service
 * Gestion de l'institution de l'utilisateur connecté
 */

import { getSupabaseClient, checkSupabase, handleError } from './base.service';
import type { ServiceResponse, Institution, InstitutionType, DashboardStats, ActivityItem } from '../types';

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
    async getMyInstitution(): Promise<ServiceResponse<Institution | undefined>> {
        const configError = checkSupabase<Institution | undefined>();
        if (configError) return configError;

        try {
            const supabase = getSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return { success: false, error: 'Utilisateur non connecté' };

            const { data, error } = await supabase
                .from('institutions')
                .select('*')
                .eq('created_by', user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return { success: true, data: data || undefined };
        } catch (error) {
            return handleError(error, 'récupération institution');
        }
    },

    async submitKYC(data: KYCSubmissionData): Promise<ServiceResponse<Institution>> {
        const configError = checkSupabase<Institution>();
        if (configError) return configError;

        try {
            const supabase = getSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return { success: false, error: 'Utilisateur non connecté' };

            // Mode de validation KYC
            // false = validation manuelle par l'administrateur (mode production)
            // true = auto-approbation (mode test uniquement)
            const AUTO_APPROVE_KYC = false;

            const institutionData: Record<string, unknown> = {
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
                kyc_status: AUTO_APPROVE_KYC ? 'approved' : 'pending',
                kyc_submitted_at: new Date().toISOString(),
            };

            // Ajouter la date de review si auto-approuvé
            if (AUTO_APPROVE_KYC) {
                institutionData.kyc_reviewed_at = new Date().toISOString();
            }

            // Check if institution exists
            const { data: existing } = await supabase
                .from('institutions')
                .select('id')
                .eq('created_by', user.id)
                .single();

            const { data: institution, error } = existing
                ? await supabase.from('institutions').update(institutionData).eq('id', existing.id).select().single()
                : await supabase.from('institutions').insert({ ...institutionData, created_by: user.id, institution_code: '' }).select().single();

            if (error) throw error;
            return { success: true, data: institution };
        } catch (error) {
            return handleError(error, 'soumission KYC');
        }
    },

    async updateInstitution(data: UpdateInstitutionData): Promise<ServiceResponse<Institution>> {
        const configError = checkSupabase<Institution>();
        if (configError) return configError;

        try {
            const supabase = getSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return { success: false, error: 'Utilisateur non connecté' };

            const updateData: Record<string, unknown> = {};
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
            return { success: true, data: institution };
        } catch (error) {
            return handleError(error, 'mise à jour institution');
        }
    },

    /**
     * Récupère les statistiques du dashboard issuer
     */
    async getDashboardStats(): Promise<ServiceResponse<DashboardStats>> {
        const configError = checkSupabase();
        if (configError) return configError as ServiceResponse<any>;

        try {
            const supabase = getSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return { success: false, error: 'Utilisateur non connecté' };

            const { data: institution } = await supabase
                .from('institutions')
                .select('id, students_count')
                .eq('created_by', user.id)
                .single();

            if (!institution) {
                return { success: true, data: { documentsIssued: 0, studentsCount: 0, documentsVerified: 0, documentsPending: 0 } };
            }

            const { data: documents } = await supabase
                .from('documents')
                .select('status')
                .eq('institution_id', institution.id);

            const docs = documents || [];
            return {
                success: true,
                data: {
                    documentsIssued: docs.filter((d: { status: string }) => d.status === 'issued').length,
                    studentsCount: institution.students_count || 0,
                    documentsVerified: 0,
                    documentsPending: docs.filter((d: { status: string }) => d.status === 'draft').length,
                },
            };
        } catch (error) {
            return handleError(error, 'stats dashboard');
        }
    },

    /**
     * Récupère l'activité récente
     */
    async getRecentActivity(limit = 10): Promise<ServiceResponse<ActivityItem[]>> {
        const configError = checkSupabase();
        if (configError) return configError as ServiceResponse<any>;

        try {
            const supabase = getSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return { success: false, error: 'Utilisateur non connecté' };

            const { data: institution } = await supabase
                .from('institutions')
                .select('id')
                .eq('created_by', user.id)
                .single();

            if (!institution) return { success: true, data: [] };

            const { data: documents } = await supabase
                .from('documents')
                .select(`id, created_at, status, student:students(full_name)`)
                .eq('institution_id', institution.id)
                .order('created_at', { ascending: false })
                .limit(limit);

            const activities = (documents || []).map((doc: any) => ({
                id: doc.id,
                type: 'document_issued' as const,
                description: `Document ${doc.status === 'issued' ? 'émis' : 'créé'} pour ${doc.student?.full_name || 'Étudiant'}`,
                createdAt: doc.created_at || new Date().toISOString(),
            }));

            return { success: true, data: activities };
        } catch (error) {
            return handleError(error, 'activité récente');
        }
    },
};
