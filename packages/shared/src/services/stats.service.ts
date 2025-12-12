/**
 * PROOFCHAIN - Stats Service
 * Statistiques globales et par institution
 */

import { withSupabase, countRecords } from './base.service';
import type { ServiceResponse, GlobalStats } from '../types';

export const statsService = {
    /**
     * Récupère les statistiques globales (admin)
     */
    async getGlobal(): Promise<ServiceResponse<GlobalStats>> {
        return withSupabase(async () => {
            const [totalInstitutions, totalStudents, totalDiplomas, totalVerifications, pendingKYC] = 
                await Promise.all([
                    countRecords('institutions'),
                    countRecords('students'),
                    countRecords('documents'),
                    countRecords('verification_logs'),
                    countRecords('institutions', { column: 'kyc_status', value: 'pending' }),
                ]);

            return { totalInstitutions, totalStudents, totalDiplomas, totalVerifications, pendingKYC };
        }, 'statsService.getGlobal');
    },

    /**
     * Récupère les statistiques d'une institution
     */
    async getByInstitution(institutionId: string): Promise<ServiceResponse<GlobalStats>> {
        return withSupabase(async () => {
            const [totalStudents, totalDiplomas] = await Promise.all([
                countRecords('students', { column: 'institution_id', value: institutionId }),
                countRecords('documents', { column: 'institution_id', value: institutionId }),
            ]);

            return { 
                totalInstitutions: 1, 
                totalStudents, 
                totalDiplomas, 
                totalVerifications: 0, 
                pendingKYC: 0 
            };
        }, 'statsService.getByInstitution');
    },
};
