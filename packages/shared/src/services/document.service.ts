/**
 * PROOFCHAIN - Document Service
 * Gestion des documents/diplômes
 */

import { withSupabase, getSupabaseClient } from './base.service';
import type { ServiceResponse, Document, Student, Institution, SubscriptionPlan } from '../types';

export interface CreateDocumentData {
    studentId: string;
    degreeType: string;
    fieldOfStudy: string;
    issueDate: string;
    graduationDate: string;
    ipfsHash?: string;
    ipfsUrl?: string;
}

export interface DocumentWithDetails extends Document {
    student?: Student;
    institution?: Institution;
}

// Limites par plan d'abonnement
const PLAN_LIMITS: Record<SubscriptionPlan, number | null> = {
    free: 10,
    basic: 100,
    premium: 1000,
    enterprise: null, // illimité
};

const DOCUMENT_WITH_RELATIONS = `*, student:students(*), institution:institutions(*)`;

export const documentService = {
    /**
     * Vérifie si l'institution peut émettre un nouveau document
     */
    async canIssueDocument(institutionId: string): Promise<ServiceResponse<{ canIssue: boolean; reason?: string; remaining?: number }>> {
        return withSupabase(async (supabase) => {
            // Récupérer l'institution avec son plan
            const { data: institution, error: instError } = await supabase
                .from('institutions')
                .select('subscription_plan, documents_issued, kyc_status')
                .eq('id', institutionId)
                .single();

            if (instError) throw instError;

            // Vérifier le KYC
            if (institution.kyc_status !== 'approved') {
                return { canIssue: false, reason: 'KYC non approuvé' };
            }

            const plan = (institution.subscription_plan || 'free') as SubscriptionPlan;
            const limit = PLAN_LIMITS[plan];
            const issued = institution.documents_issued || 0;

            // Plan illimité
            if (limit === null) {
                return { canIssue: true, remaining: -1 };
            }

            // Vérifier la limite
            if (issued >= limit) {
                return { 
                    canIssue: false, 
                    reason: `Limite atteinte (${limit} documents pour le plan ${plan})`,
                    remaining: 0 
                };
            }

            return { canIssue: true, remaining: limit - issued };
        }, 'vérification quota');
    },

    async create(institutionId: string, data: CreateDocumentData): Promise<ServiceResponse<Document>> {
        return withSupabase(async (supabase) => {
            // Vérifier le quota avant création
            const quotaCheck = await documentService.canIssueDocument(institutionId);
            if (!quotaCheck.success) throw new Error(quotaCheck.error);
            if (!quotaCheck.data?.canIssue) {
                throw new Error(quotaCheck.data?.reason || 'Impossible d\'émettre un document');
            }

            const { data: document, error } = await supabase
                .from('documents')
                .insert({
                    institution_id: institutionId,
                    student_id: data.studentId,
                    degree_type: data.degreeType,
                    field_of_study: data.fieldOfStudy,
                    issue_date: data.issueDate,
                    graduation_date: data.graduationDate,
                    ipfs_hash: data.ipfsHash || null,
                    ipfs_url: data.ipfsUrl || null,
                    status: 'draft',
                    document_code: '',
                    document_id: '',
                })
                .select()
                .single();

            if (error) throw error;
            return document;
        }, 'création document');
    },

    async updateAfterMint(
        documentId: string, 
        mintData: { txHash: string; assetId: string; policyId: string; assetName: string }
    ): Promise<ServiceResponse<void>> {
        return withSupabase(async (supabase) => {
            const { error } = await supabase
                .from('documents')
                .update({
                    tx_hash: mintData.txHash,
                    asset_id: mintData.assetId,
                    policy_id: mintData.policyId,
                    asset_name: mintData.assetName,
                    status: 'issued',
                })
                .eq('id', documentId);

            if (error) throw error;
        }, 'mise à jour document après mint');
    },

    async getById(id: string): Promise<ServiceResponse<DocumentWithDetails>> {
        return withSupabase(async (supabase) => {
            const { data, error } = await supabase
                .from('documents')
                .select(DOCUMENT_WITH_RELATIONS)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as DocumentWithDetails;
        }, 'récupération document');
    },

    async getByDocumentId(documentId: string): Promise<ServiceResponse<DocumentWithDetails>> {
        return withSupabase(async (supabase) => {
            const { data, error } = await supabase
                .from('documents')
                .select(DOCUMENT_WITH_RELATIONS)
                .eq('document_id', documentId)
                .single();

            if (error) throw error;
            return data as DocumentWithDetails;
        }, 'récupération document par ID');
    },

    async getByAssetId(assetId: string): Promise<ServiceResponse<DocumentWithDetails>> {
        return withSupabase(async (supabase) => {
            const { data, error } = await supabase
                .from('documents')
                .select(DOCUMENT_WITH_RELATIONS)
                .eq('asset_id', assetId)
                .single();

            if (error) throw error;
            return data as DocumentWithDetails;
        }, 'récupération document par asset ID');
    },

    async getByInstitution(institutionId: string): Promise<ServiceResponse<DocumentWithDetails[]>> {
        return withSupabase(async (supabase) => {
            const { data, error } = await supabase
                .from('documents')
                .select(`*, student:students(*)`)
                .eq('institution_id', institutionId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return (data || []) as DocumentWithDetails[];
        }, 'récupération documents');
    },

    async getStats(institutionId: string): Promise<ServiceResponse<{ total: number; issued: number; draft: number; revoked: number }>> {
        return withSupabase(async (supabase) => {
            const { data, error } = await supabase
                .from('documents')
                .select('status')
                .eq('institution_id', institutionId);

            if (error) throw error;

            const docs = data || [];
            return {
                total: docs.length,
                issued: docs.filter((d: { status: string }) => d.status === 'issued').length,
                draft: docs.filter((d: { status: string }) => d.status === 'draft').length,
                revoked: docs.filter((d: { status: string }) => d.status === 'revoked').length,
            };
        }, 'stats documents');
    },

    async revoke(documentId: string, reason: string, revokedBy: string): Promise<ServiceResponse<void>> {
        return withSupabase(async (supabase) => {
            const { error } = await supabase
                .from('documents')
                .update({
                    status: 'revoked',
                    revoked_at: new Date().toISOString(),
                    revoked_by: revokedBy,
                    revocation_reason: reason,
                })
                .eq('id', documentId);

            if (error) throw error;
        }, 'révocation document');
    },

    /**
     * Récupère les documents en brouillon (mint échoué ou non terminé)
     */
    async getDrafts(institutionId: string): Promise<ServiceResponse<DocumentWithDetails[]>> {
        return withSupabase(async (supabase) => {
            const { data, error } = await supabase
                .from('documents')
                .select(`*, student:students(*)`)
                .eq('institution_id', institutionId)
                .eq('status', 'draft')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return (data || []) as DocumentWithDetails[];
        }, 'récupération brouillons');
    },

    /**
     * Supprime un document en brouillon
     */
    async deleteDraft(documentId: string): Promise<ServiceResponse<void>> {
        return withSupabase(async (supabase) => {
            // Vérifier que c'est bien un brouillon
            const { data: doc, error: checkError } = await supabase
                .from('documents')
                .select('status')
                .eq('id', documentId)
                .single();

            if (checkError) throw checkError;
            if (doc.status !== 'draft') {
                throw new Error('Seuls les brouillons peuvent être supprimés');
            }

            const { error } = await supabase
                .from('documents')
                .delete()
                .eq('id', documentId);

            if (error) throw error;
        }, 'suppression brouillon');
    },

    /**
     * Met à jour un document brouillon pour retenter le mint
     */
    async updateDraft(documentId: string, data: Partial<CreateDocumentData>): Promise<ServiceResponse<Document>> {
        return withSupabase(async (supabase) => {
            const updateData: Record<string, unknown> = {};
            if (data.degreeType) updateData.degree_type = data.degreeType;
            if (data.fieldOfStudy) updateData.field_of_study = data.fieldOfStudy;
            if (data.graduationDate) updateData.graduation_date = data.graduationDate;
            if (data.ipfsHash) updateData.ipfs_hash = data.ipfsHash;
            if (data.ipfsUrl) updateData.ipfs_url = data.ipfsUrl;

            const { data: document, error } = await supabase
                .from('documents')
                .update(updateData)
                .eq('id', documentId)
                .eq('status', 'draft')
                .select()
                .single();

            if (error) throw error;
            return document;
        }, 'mise à jour brouillon');
    },

    /**
     * Récupère un document brouillon par son ID pour reprendre le mint
     */
    async getDraftById(documentId: string): Promise<ServiceResponse<DocumentWithDetails>> {
        return withSupabase(async (supabase) => {
            const { data, error } = await supabase
                .from('documents')
                .select(DOCUMENT_WITH_RELATIONS)
                .eq('id', documentId)
                .eq('status', 'draft')
                .single();

            if (error) throw error;
            return data as DocumentWithDetails;
        }, 'récupération brouillon');
    },
};
