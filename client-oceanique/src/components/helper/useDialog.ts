// hooks/useDialog.ts
import { useState, useCallback } from 'react';

interface DialogState {
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    redirectPath?: string;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

interface DialogActions {
    showSuccess: (title: string, message: string, options?: Partial<DialogState>) => void;
    showError: (title: string, message: string, options?: Partial<DialogState>) => void;
    showWarning: (title: string, message: string, options?: Partial<DialogState>) => void;
    showInfo: (title: string, message: string, options?: Partial<DialogState>) => void;
    showDialog: (config: Partial<DialogState>) => void;
    closeDialog: () => void;
}

const initialState: DialogState = {
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Cancel',
    showCancel: false,
    autoClose: false,
    autoCloseDelay: 3000
};

export const useDialog = (): [DialogState, DialogActions] => {
    const [dialogState, setDialogState] = useState<DialogState>(initialState);

    const showDialog = useCallback((config: Partial<DialogState>) => {
        setDialogState(prev => ({
            ...prev,
            ...config,
            isOpen: true
        }));
    }, []);

    const showSuccess = useCallback((title: string, message: string, options?: Partial<DialogState>) => {
        showDialog({
            type: 'success',
            title,
            message,
            confirmText: 'Continue',
            ...options
        });
    }, [showDialog]);

    const showError = useCallback((title: string, message: string, options?: Partial<DialogState>) => {
        showDialog({
            type: 'error',
            title,
            message,
            confirmText: 'Close',
            ...options
        });
    }, [showDialog]);

    const showWarning = useCallback((title: string, message: string, options?: Partial<DialogState>) => {
        showDialog({
            type: 'warning',
            title,
            message,
            confirmText: 'OK',
            ...options
        });
    }, [showDialog]);

    const showInfo = useCallback((title: string, message: string, options?: Partial<DialogState>) => {
        showDialog({
            type: 'info',
            title,
            message,
            confirmText: 'OK',
            ...options
        });
    }, [showDialog]);

    const closeDialog = useCallback(() => {
        setDialogState(prev => ({ ...prev, isOpen: false }));
    }, []);

    const actions: DialogActions = {
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showDialog,
        closeDialog
    };

    return [dialogState, actions];
};