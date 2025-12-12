/**
 * PROOFCHAIN - Document Service
 * Gestion des documents/diplômes
 */

import { withSupabase } from './base.service';
import type { ServiceResponse, Document, Student, Institution } from '../types';

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

const DOCUMENT_WITH_RELATIONS = `*, student:students(*), institution:institutions(*)`;

export const documentService = {
    async create(institutionId: string, data: CreateDocumentData): Promise<ServiceResponse<Document>> {
        return withSupabase(async (supabase) => {
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
};
