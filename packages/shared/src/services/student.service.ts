/**
 * PROOFCHAIN - Student Service
 * Service pour gérer les étudiants avec Supabase
 */

import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type { Student } from '../types/database.types';

export interface CreateStudentData {
    fullName: string;
    email?: string;
    phone?: string;
    studentNumber: string;
    program?: string;
    fieldOfStudy?: string;
    enrollmentDate?: string;
}

export interface UpdateStudentData {
    fullName?: string;
    email?: string;
    phone?: string;
    program?: string;
    fieldOfStudy?: string;
    status?: string;
}

export const studentService = {
    /**
     * Créer un nouvel étudiant
     */
    async create(institutionId: string, data: CreateStudentData): Promise<{ success: boolean; student?: Student; error?: string }> {
        if (!isSupabaseConfigured()) {
            return { success: false, error: 'Supabase non configuré' };
        }

        try {
            const supabase = getSupabaseClient();
            
            const { data: student, error } = await supabase
                .from('students')
                .insert({
                    institution_id: institutionId,
                    full_name: data.fullName,
                    email: data.email || null,
                    phone: data.phone || null,
                    student_number: data.studentNumber,
                    program: data.program || null,
                    field_of_study: data.fieldOfStudy || null,
                    enrollment_date: data.enrollmentDate || null,
                    status: 'active',
                })
                .select()
                .single();

            if (error) throw error;

            return { success: true, student };
        } catch (error: any) {
            console.error('Erreur création étudiant:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Mettre à jour un étudiant
     */
    async update(studentId: string, data: UpdateStudentData): Promise<{ success: boolean; student?: Student; error?: string }> {
        if (!isSupabaseConfigured()) {
            return { success: false, error: 'Supabase non configuré' };
        }

        try {
            const supabase = getSupabaseClient();
            
            const updateData: any = {};
            if (data.fullName) updateData.full_name = data.fullName;
            if (data.email !== undefined) updateData.email = data.email;
            if (data.phone !== undefined) updateData.phone = data.phone;
            if (data.program !== undefined) updateData.program = data.program;
            if (data.fieldOfStudy !== undefined) updateData.field_of_study = data.fieldOfStudy;
            if (data.status !== undefined) updateData.status = data.status;

            const { data: student, error } = await supabase
                .from('students')
                .update(updateData)
                .eq('id', studentId)
                .select()
                .single();

            if (error) throw error;

            return { success: true, student };
        } catch (error: any) {
            console.error('Erreur mise à jour étudiant:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Supprimer un étudiant
     */
    async delete(studentId: string): Promise<{ success: boolean; error?: string }> {
        if (!isSupabaseConfigured()) {
            return { success: false, error: 'Supabase non configuré' };
        }

        try {
            const supabase = getSupabaseClient();
            
            const { error } = await supabase
                .from('students')
                .delete()
                .eq('id', studentId);

            if (error) throw error;

            return { success: true };
        } catch (error: any) {
            console.error('Erreur suppression étudiant:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Récupérer un étudiant par ID
     */
    async getById(studentId: string): Promise<{ success: boolean; student?: Student; error?: string }> {
        if (!isSupabaseConfigured()) {
            return { success: false, error: 'Supabase non configuré' };
        }

        try {
            const supabase = getSupabaseClient();
            
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('id', studentId)
                .single();

            if (error) throw error;

            return { success: true, student: data };
        } catch (error: any) {
            console.error('Erreur récupération étudiant:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Récupérer tous les étudiants d'une institution
     */
    async getByInstitution(institutionId: string): Promise<{ success: boolean; students?: Student[]; error?: string }> {
        if (!isSupabaseConfigured()) {
            return { success: false, error: 'Supabase non configuré' };
        }

        try {
            const supabase = getSupabaseClient();
            
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('institution_id', institutionId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return { success: true, students: data };
        } catch (error: any) {
            console.error('Erreur récupération étudiants:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Rechercher des étudiants
     */
    async search(institutionId: string, query: string): Promise<{ success: boolean; students?: Student[]; error?: string }> {
        if (!isSupabaseConfigured()) {
            return { success: false, error: 'Supabase non configuré' };
        }

        try {
            const supabase = getSupabaseClient();
            
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('institution_id', institutionId)
                .or(`full_name.ilike.%${query}%,student_number.ilike.%${query}%,email.ilike.%${query}%`)
                .order('full_name', { ascending: true });

            if (error) throw error;

            return { success: true, students: data };
        } catch (error: any) {
            console.error('Erreur recherche étudiants:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Récupérer les statistiques des étudiants d'une institution
     */
    async getStats(institutionId: string): Promise<{ 
        success: boolean; 
        stats?: { total: number; active: number; graduated: number; suspended: number }; 
        error?: string 
    }> {
        if (!isSupabaseConfigured()) {
            return { success: false, error: 'Supabase non configuré' };
        }

        try {
            const supabase = getSupabaseClient();
            
            const { data, error } = await supabase
                .from('students')
                .select('status')
                .eq('institution_id', institutionId);

            if (error) throw error;

            const stats = {
                total: data?.length || 0,
                active: data?.filter((s: { status: string }) => s.status === 'active').length || 0,
                graduated: data?.filter((s: { status: string }) => s.status === 'graduated').length || 0,
                suspended: data?.filter((s: { status: string }) => s.status === 'suspended').length || 0,
            };

            return { success: true, stats };
        } catch (error: any) {
            console.error('Erreur récupération stats:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Import CSV d'étudiants
     */
    async importFromCSV(
        institutionId: string, 
        students: CreateStudentData[]
    ): Promise<{ success: boolean; imported: number; errors: string[]; error?: string }> {
        if (!isSupabaseConfigured()) {
            return { success: false, imported: 0, errors: [], error: 'Supabase non configuré' };
        }

        const errors: string[] = [];
        let imported = 0;

        try {
            const supabase = getSupabaseClient();

            for (const student of students) {
                try {
                    const { error } = await supabase
                        .from('students')
                        .insert({
                            institution_id: institutionId,
                            full_name: student.fullName,
                            email: student.email || null,
                            phone: student.phone || null,
                            student_number: student.studentNumber,
                            program: student.program || null,
                            field_of_study: student.fieldOfStudy || null,
                            enrollment_date: student.enrollmentDate || null,
                            status: 'active',
                        });

                    if (error) {
                        errors.push(`${student.studentNumber}: ${error.message}`);
                    } else {
                        imported++;
                    }
                } catch (e: any) {
                    errors.push(`${student.studentNumber}: ${e.message}`);
                }
            }

            return { success: true, imported, errors };
        } catch (error: any) {
            console.error('Erreur import CSV:', error);
            return { success: false, imported, errors, error: error.message };
        }
    },
};
