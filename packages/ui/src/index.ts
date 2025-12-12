/**
 * PROOFCHAIN - UI Package Index
 */

// Components
export { ConnectWalletButton } from './components/ConnectWalletButton';
export { WalletSelector } from './components/WalletSelector';
export { InstitutionCard } from './components/InstitutionCard';
export { Sidebar } from './components/Sidebar';
export { ThemeToggle } from './components/ThemeToggle';
export { IPFSImage } from './components/IPFSImage';
export { NotificationButton } from './components/NotificationButton';
export { AppLayout } from './components/AppLayout';

// Auth components
export { AuthForm } from './components/AuthForm';
export { UserMenu } from './components/UserMenu';

// Optimized components
export { Card, CardHeader, StatCard, EmptyState } from './components/Card';
export { InputField, TextAreaField, SelectField, ToggleSwitch } from './components/FormField';
export { Button } from './components/Button';
export { DataTable } from './components/DataTable';
export { Modal } from './components/Modal';
export { Pagination } from './components/Pagination';
export { LoadingSpinner } from './components/LoadingSpinner';
export { Toast, ToastContainer } from './components/Toast';
export { Skeleton, SkeletonCard, SkeletonTable } from './components/Skeleton';
export { PageHeader } from './components/PageHeader';
export { ThemeScript } from './components/ThemeScript';
export { Logo, type LogoProps } from './components/Logo';

// Hooks
export { useWallet } from './hooks/useWallet';
export { useTheme } from './hooks/useTheme';

// Utilities
export * from './lib/constants';
export * from './lib/storage';

// Assets
export { ProofchainLogoSVG } from './assets/ProofchainLogo';
export { EternlIcon, EternlMobileIcon, LaceIcon, NamiIcon, WalletIconMap } from './assets/WalletIcons';

// Types
export type { WalletState, WalletType, WalletInfo } from './hooks/useWallet';
export type { Theme } from './hooks/useTheme';
export type { SidebarItem } from './components/Sidebar';
export type { Notification } from './components/NotificationButton';
export type { CardProps, CardHeaderProps, StatCardProps, EmptyStateProps } from './components/Card';
export type { InputFieldProps, TextAreaFieldProps, SelectFieldProps, ToggleSwitchProps } from './components/FormField';
export type { ButtonProps } from './components/Button';
export type { Column, DataTableProps } from './components/DataTable';
export type { ModalProps } from './components/Modal';
export type { PaginationProps } from './components/Pagination';
export type { LoadingSpinnerProps } from './components/LoadingSpinner';
export type { ToastProps, ToastContainerProps } from './components/Toast';
export type { AuthFormProps, AuthFormData, AuthMode } from './components/AuthForm';
export type { UserMenuProps } from './components/UserMenu';
export type { PageHeaderProps } from './components/PageHeader';
