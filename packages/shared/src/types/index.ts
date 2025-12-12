/**
 * PROOFCHAIN - Types
 * Re-export de tous les types
 */

// Database types (Supabase)
export type {
    Database,
    Institution,
    Student,
    Document,
    Country,
    VerificationLog,
    ImportLog,
    SubscriptionPlanData,
    AdminLog,
    InstitutionType,
    KYCStatus,
    DocumentStatus,
    SubscriptionPlan,
    CurrencyType,
    Json,
} from './database.types';

// Service Response
export interface ServiceResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

// Pagination
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Form State
export interface FormState<T> {
    data: T;
    errors: Partial<Record<keyof T, string>>;
    isSubmitting: boolean;
    isValid: boolean;
}

// Auth User (from Supabase Auth)
export interface AuthUser {
    id: string;
    email: string;
    role?: 'admin' | 'issuer' | 'verifier';
    institutionId?: string;
}

// Dashboard Stats
export interface DashboardStats {
    documentsIssued: number;
    studentsCount: number;
    documentsVerified: number;
    documentsPending: number;
}

// Global Stats (Admin)
export interface GlobalStats {
    totalInstitutions: number;
    totalStudents: number;
    totalDiplomas: number;
    totalVerifications: number;
    pendingKYC: number;
}

// Activity Item
export interface ActivityItem {
    id: string;
    type: 'document_issued' | 'student_added' | 'verification' | 'kyc_approved' | 'kyc_rejected';
    description: string;
    createdAt: string;
}

// Notification
export interface Notification {
    id: string;
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    actionUrl?: string;
}

// NFT Metadata (CIP-25)
export interface NFTMetadata {
    name: string;
    image: string;
    description: string;
    documentId: string;
    student: string;
    degree: string;
    field: string;
    institution: string;
    issueDate: string;
    graduationDate: string;
}
