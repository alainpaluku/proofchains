/**
 * PROOFCHAIN - Global App Context
 * Gestion d'état global avec Context API
 */

'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import type { AuthUser, Notification, Institution } from '../types';

// State
interface AppState {
    user: AuthUser | null;
    institution: Institution | null;
    notifications: Notification[];
    isLoading: boolean;
    error: string | null;
}

// Actions
type AppAction =
    | { type: 'SET_USER'; payload: AuthUser | null }
    | { type: 'SET_INSTITUTION'; payload: Institution | null }
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'MARK_NOTIFICATION_READ'; payload: string }
    | { type: 'CLEAR_NOTIFICATIONS' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: AppState = {
    user: null,
    institution: null,
    notifications: [],
    isLoading: false,
    error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'SET_INSTITUTION':
            return { ...state, institution: action.payload };
        case 'ADD_NOTIFICATION':
            return { ...state, notifications: [action.payload, ...state.notifications] };
        case 'MARK_NOTIFICATION_READ':
            return {
                ...state,
                notifications: state.notifications.map(n =>
                    n.id === action.payload ? { ...n, read: true } : n
                ),
            };
        case 'CLEAR_NOTIFICATIONS':
            return { ...state, notifications: [] };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        default:
            return state;
    }
}

// Context
interface AppContextValue extends AppState {
    setUser: (user: AuthUser | null) => void;
    setInstitution: (institution: Institution | null) => void;
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
    markNotificationRead: (id: string) => void;
    clearNotifications: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const setUser = useCallback((user: AuthUser | null) => {
        dispatch({ type: 'SET_USER', payload: user });
    }, []);

    const setInstitution = useCallback((institution: Institution | null) => {
        dispatch({ type: 'SET_INSTITUTION', payload: institution });
    }, []);

    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
        const fullNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            read: false,
        };
        dispatch({ type: 'ADD_NOTIFICATION', payload: fullNotification });
    }, []);

    const markNotificationRead = useCallback((id: string) => {
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
    }, []);

    const clearNotifications = useCallback(() => {
        dispatch({ type: 'CLEAR_NOTIFICATIONS' });
    }, []);

    const setLoading = useCallback((loading: boolean) => {
        dispatch({ type: 'SET_LOADING', payload: loading });
    }, []);

    const setError = useCallback((error: string | null) => {
        dispatch({ type: 'SET_ERROR', payload: error });
    }, []);

    const value: AppContextValue = {
        ...state,
        setUser,
        setInstitution,
        addNotification,
        markNotificationRead,
        clearNotifications,
        setLoading,
        setError,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook
export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}
