/**
 * PROOFCHAIN - Student Service
 * Gestion des étudiants
 */

import { withSupabase, getSupabaseClient } from './base.service';
import type { ServiceResponse, Student } from '../types';

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
    async create(institutionId: string, data: CreateStudentData): Promise<ServiceResponse<Student>> {
        return withSupabase(async (supabase) => {
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
            return student;
        }, 'création étudiant');
    },

    async update(studentId: string, data: UpdateStudentData): Promise<ServiceResponse<Student>> {
        return withSupabase(async (supabase) => {
            const updateData: Record<string, unknown> = {};
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
            return student;
        }, 'mise à jour étudiant');
    },

    async delete(studentId: string): Promise<ServiceResponse<void>> {
        return withSupabase(async (supabase) => {
            const { error } = await supabase.from('students').delete().eq('id', studentId);
            if (error) throw error;
        }, 'suppression étudiant');
    },

    async getById(studentId: string): Promise<ServiceResponse<Student>> {
        return withSupabase(async (supabase) => {
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('id', studentId)
                .single();

            if (error) throw error;
            return data;
        }, 'récupération étudiant');
    },

    async getByInstitution(institutionId: string): Promise<ServiceResponse<Student[]>> {
        return withSupabase(async (supabase) => {
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('institution_id', institutionId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        }, 'récupération étudiants');
    },

    async search(institutionId: string, query: string): Promise<ServiceResponse<Student[]>> {
        return withSupabase(async (supabase) => {
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('institution_id', institutionId)
                .or(`full_name.ilike.%${query}%,student_number.ilike.%${query}%,email.ilike.%${query}%`)
                .order('full_name', { ascending: true });

            if (error) throw error;
            return data || [];
        }, 'recherche étudiants');
    },

    async getStats(institutionId: string): Promise<ServiceResponse<{ total: number; active: number; graduated: number; suspended: number }>> {
        return withSupabase(async (supabase) => {
            const { data, error } = await supabase
                .from('students')
                .select('status')
                .eq('institution_id', institutionId);

            if (error) throw error;

            const students = data || [];
            return {
                total: students.length,
                active: students.filter((s: { status: string | null }) => s.status === 'active').length,
                graduated: students.filter((s: { status: string | null }) => s.status === 'graduated').length,
                suspended: students.filter((s: { status: string | null }) => s.status === 'suspended').length,
            };
        }, 'stats étudiants');
    },

    async importFromCSV(institutionId: string, students: CreateStudentData[]): Promise<{ success: boolean; imported: number; errors: string[] }> {
        const supabase = getSupabaseClient();
        const errors: string[] = [];
        let imported = 0;

        for (const student of students) {
            const { error } = await supabase.from('students').insert({
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

            if (error) errors.push(`${student.studentNumber}: ${error.message}`);
            else imported++;
        }

        return { success: true, imported, errors };
    },
};
