// components/DialogMessage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface DialogMessageProps {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    isOpen: boolean;
    onClose: () => void;
    redirectPath?: string;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

const DialogMessage: React.FC<DialogMessageProps> = ({
    type,
    title,
    message,
    isOpen,
    onClose,
    redirectPath,
    onConfirm,
    confirmText = 'OK',
    cancelText = 'Cancel',
    showCancel = false,
    autoClose = false,
    autoCloseDelay = 3000
}) => {
    const navigate = useNavigate();

    // Auto close functionality
    React.useEffect(() => {
        if (autoClose && isOpen) {
            const timer = setTimeout(() => {
                handleClose();
            }, autoCloseDelay);
            return () => clearTimeout(timer);
        }
    }, [autoClose, isOpen, autoCloseDelay]);

    const handleClose = () => {
        onClose();
        if (type === 'success' && redirectPath) {
            navigate(redirectPath, { replace: true });
        }
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        } else {
            handleClose();
        }
    };

    const styles = {
        success: {
            background: 'bg-white',
            title: 'text-teal-600',
            button: 'bg-teal-500 hover:bg-teal-600',
            icon: (
                <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            )
        },
        error: {
            background: 'bg-white',
            title: 'text-red-600',
            button: 'bg-red-500 hover:bg-red-600',
            icon: (
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            )
        },
        warning: {
            background: 'bg-white',
            title: 'text-orange-600',
            button: 'bg-orange-500 hover:bg-orange-600',
            icon: (
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            )
        },
        info: {
            background: 'bg-white',
            title: 'text-blue-600',
            button: 'bg-blue-500 hover:bg-blue-600',
            icon: (
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/10">
                <div
                    className={`${styles[type].background} rounded-lg shadow-lg p-8 max-w-sm w-full text-center animate-popup`}
                >
                    {/* Icon */}
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        {styles[type].icon}
                    </div>

                    {/* Title */}
                    <h3 className={`text-2xl font-bold mb-4 ${styles[type].title}`}>
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="mb-6 text-gray-700">
                        {message}
                    </p>

                    {/* Buttons */}
                    <div className={`flex ${showCancel ? 'space-x-3' : ''}`}>
                        {showCancel && (
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            onClick={handleConfirm}
                            className={`${showCancel ? 'flex-1' : 'w-full'} px-6 py-2 text-white rounded transition-colors ${styles[type].button}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>

            <style>
                {`
                @keyframes popup {
                    0% {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-popup {
                    animation: popup 0.3s cubic-bezier(0.22, 1, 0.36, 1);
                }
                `}
            </style>
        </>
    );
};

export default DialogMessage;