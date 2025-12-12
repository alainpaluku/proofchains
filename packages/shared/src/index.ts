/**
 * PROOFCHAIN - Shared Package
 * Exports centralisés pour toutes les applications
 */

// ============================================================================
// TYPES
// ============================================================================
export type {
    // Database types
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
    // App types
    ServiceResponse,
    PaginatedResponse,
    FormState,
    AuthUser,
    DashboardStats,
    GlobalStats,
    ActivityItem,
    Notification,
    NFTMetadata,
} from './types';

// ============================================================================
// CONSTANTS
// ============================================================================
export {
    ADMIN_EMAIL,
    INSTITUTION_TYPES,
    KYC_STATUS,
    DOCUMENT_STATUS,
    SUBSCRIPTION_PLANS,
    CARDANO_NETWORKS,
    IPFS_GATEWAYS,
    LIMITS,
    DATE_FORMATS,
} from './constants';

// ============================================================================
// SERVICES
// ============================================================================
export { documentService } from './services/document.service';
export { studentService } from './services/student.service';
export { issuerService } from './services/issuer.service';
export { adminService } from './services/admin.service';
export { statsService } from './services/stats.service';

// Service types
export type { KYCPendingRequest } from './services/admin.service';
export type { CreateStudentData, UpdateStudentData } from './services/student.service';
export type { CreateDocumentData, DocumentWithDetails } from './services/document.service';
export type { KYCSubmissionData, UpdateInstitutionData } from './services/issuer.service';

// ============================================================================
// HOOKS
// ============================================================================
export { useAsync } from './hooks/useAsync';
export { useForm } from './hooks/useForm';
export { usePagination } from './hooks/usePagination';
export { useLocalStorage } from './hooks/useLocalStorage';
export { useDebounce } from './hooks/useDebounce';
export { useDebounceCallback } from './hooks/useDebounceCallback';
export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop, useIsDarkMode } from './hooks/useMediaQuery';

// ============================================================================
// CONTEXTS
// ============================================================================
export { AppProvider, useApp } from './contexts/AppContext';

// ============================================================================
// COMPONENTS
// ============================================================================
export { AuthProvider, useAuth } from './components/AuthProvider';
export { AuthWrapper } from './components/AuthWrapper';
export type { AuthWrapperProps } from './components/AuthWrapper';

// ============================================================================
// AUTH
// ============================================================================
export { 
    signUp, 
    signInWithEmail, 
    signOut, 
    resetPassword, 
    updatePassword,
    getCurrentUser,
    onAuthStateChange,
    isAdminEmail,
} from './lib/auth';
export type { AuthError } from './lib/auth';

// ============================================================================
// SUPABASE
// ============================================================================
export { 
    getSupabaseClient, 
    supabase, 
    isSupabaseConfigured, 
    createServerSupabaseClient 
} from './lib/supabase';

// ============================================================================
// UTILS
// ============================================================================
export {
    formatDate,
    formatDateTime,
    formatRelativeTime,
    formatCurrency,
    formatNumber,
    truncateAddress,
    truncateText,
    formatFileSize,
} from './utils/format';

export { validators, composeValidators } from './utils/validation';
