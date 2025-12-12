/**
 * PROOFCHAIN - Admin Service
 * Gestion des institutions et validation KYC (admin uniquement)
 */

import { 
    withSupabase, 
    countRecords, 
    getSupabaseClient, 
    checkSupabase, 
    handleError,
    isCurrentUserAdmin,
} from './base.service';
import type { ServiceResponse, Institution, KYCStatus } from '../types';

export interface KYCPendingRequest {
    id: string;
    institutionCode: string;
    name: string;
    email: string;
    phone: string | null;
    website: string | null;
    type: string;
    countryCode: string;
    address: string | null;
    taxId: string | null;
    registrationNumber: string | null;
    kycSubmittedAt: string | null;
    documents: {
        legalDocs: string | null;
        accreditation: string | null;
        taxCertificate: string | null;
        ministerialDecree: string | null;
    };
}

export interface AdminStats {
    totalInstitutions: number;
    pendingKYC: number;
    approvedKYC: number;
    rejectedKYC: number;
    totalDocuments: number;
    totalStudents: number;
}

const mapToKYCRequest = (inst: Institution): KYCPendingRequest => ({
    id: inst.id,
    institutionCode: inst.institution_code,
    name: inst.name,
    email: inst.email,
    phone: inst.phone,
    website: inst.website,
    type: inst.type,
    countryCode: inst.country_code,
    address: inst.address,
    taxId: inst.tax_id,
    registrationNumber: inst.registration_number,
    kycSubmittedAt: inst.kyc_submitted_at,
    documents: {
        legalDocs: inst.legal_docs_url,
        accreditation: inst.accreditation_url,
        taxCertificate: inst.tax_certificate_url,
        ministerialDecree: inst.ministerial_decree_url,
    },
});

export const adminService = {
    async getPendingKYCRequests(): Promise<ServiceResponse<KYCPendingRequest[]>> {
        return withSupabase(async (supabase) => {
            const { data, error } = await supabase
                .from('institutions')
                .select('*')
                .eq('kyc_status', 'pending')
                .order('kyc_submitted_at', { ascending: true });

            if (error) throw error;
            return (data || []).map(mapToKYCRequest);
        }, 'récupération demandes KYC');
    },

    async getAllInstitutions(filters?: { 
        kycStatus?: KYCStatus; 
        countryCode?: string;
        type?: string;
    }): Promise<ServiceResponse<Institution[]>> {
        return withSupabase(async (supabase) => {
            let query = supabase
                .from('institutions')
                .select('*')
                .order('created_at', { ascending: false });

            if (filters?.kycStatus) query = query.eq('kyc_status', filters.kycStatus);
            if (filters?.countryCode) query = query.eq('country_code', filters.countryCode);
            if (filters?.type) query = query.eq('type', filters.type);

            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        }, 'récupération institutions');
    },

    async updateKYCStatus(
        institutionId: string, 
        status: 'approved' | 'rejected', 
        reason?: string
    ): Promise<ServiceResponse<Institution>> {
        const configError = checkSupabase<Institution>();
        if (configError) return configError;

        try {
            const supabase = getSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) return { success: false, error: 'Admin non connecté' };

            if (!(await isCurrentUserAdmin())) {
                return { success: false, error: 'Accès non autorisé. Seuls les admins peuvent effectuer cette action.' };
            }

            const { data, error } = await supabase
                .from('institutions')
                .update({
                    kyc_status: status,
                    kyc_reviewed_at: new Date().toISOString(),
                    kyc_reviewed_by: user.id,
                    kyc_rejection_reason: status === 'rejected' ? reason : null,
                })
                .eq('id', institutionId)
                .select()
                .single();

            if (error) {
                if (error.code === '42501' || error.message?.includes('policy')) {
                    return { success: false, error: 'Permission refusée. Vérifiez les politiques RLS.' };
                }
                throw error;
            }

            // Log admin action (non-blocking)
            supabase.from('admin_logs').insert({
                admin_id: user.id,
                action: `kyc_${status}`,
                target_type: 'institution',
                target_id: institutionId,
                details: { institution_name: data?.name, ...(reason && { reason }) },
            }).then(() => {}).catch(() => {});

            return { success: true, data };
        } catch (error) {
            return handleError(error, `${status === 'approved' ? 'approbation' : 'rejet'} KYC`);
        }
    },

    async approveKYC(institutionId: string): Promise<ServiceResponse<Institution>> {
        return this.updateKYCStatus(institutionId, 'approved');
    },

    async rejectKYC(institutionId: string, reason: string): Promise<ServiceResponse<Institution>> {
        return this.updateKYCStatus(institutionId, 'rejected', reason);
    },

    async getCountries(): Promise<ServiceResponse<Array<{ code: string; name: string }>>> {
        return withSupabase(async (supabase) => {
            const { data, error } = await supabase
                .from('countries')
                .select('code, name')
                .order('name');

            if (error) throw error;
            return data || [];
        }, 'récupération pays');
    },

    /**
     * Récupère les statistiques admin
     */
    async getAdminStats(): Promise<ServiceResponse<AdminStats>> {
        return withSupabase(async () => {
            const [totalInstitutions, pendingKYC, approvedKYC, rejectedKYC, totalDocuments, totalStudents] = 
                await Promise.all([
                    countRecords('institutions'),
                    countRecords('institutions', { column: 'kyc_status', value: 'pending' }),
                    countRecords('institutions', { column: 'kyc_status', value: 'approved' }),
                    countRecords('institutions', { column: 'kyc_status', value: 'rejected' }),
                    countRecords('documents'),
                    countRecords('students'),
                ]);

            return { totalInstitutions, pendingKYC, approvedKYC, rejectedKYC, totalDocuments, totalStudents };
        }, 'adminService.getAdminStats');
    },
};
