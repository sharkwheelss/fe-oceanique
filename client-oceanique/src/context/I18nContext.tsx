// contexts/I18nContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Define supported languages
export const SUPPORTED_LANGUAGES = {
    en: 'English',
    id: 'Bahasa Indonesia'
} as const;

export type Language = keyof typeof SUPPORTED_LANGUAGES;

// Translation type (you'll expand this based on your needs)
interface Translations {
    [key: string]: string | Translations;
}

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, params?: Record<string, string>) => string;
    isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Translation files
const translations = {
    en: {
        common: {
            signin: "Sign In",
            signup: "Sign Up",
            register: "Register",
            email: "Email",
            username: "Username",
            password: "Password",
            forgotPassword: "Forgot password?",
            dontHaveAccount: "Don't have an account?",
            registerHere: "Register here",
            loading: "Loading...",
            submit: "Submit",
            cancel: "Cancel",
            confirm: "Confirm",
            success: "Success",
            error: "Error",
            warning: "Warning"
        },
        signin: {
            title: "Discover Breathtaking Indonesian Shores with",
            subtitle: "– Try our recommendation now!",
            emailOrUsernamePlaceholder: "Enter email or username",
            passwordPlaceholder: "Password",
            signinButton: "Sign in",
            eventAdminQuestion: "Are you the one who held event?",
            eventAdminButton: "Sign in here!",
            successTitle: "Sign In Successful!",
            successMessage: "Welcome back to Oceanique!",
            failedTitle: "Sign In Failed!",
            failedMessage: "Login failed",
            wrongPageTitle: "Wrong Sign In Page",
            wrongPageMessage: "You are trying to sign in as a {userType}, but you're on the wrong sign in page. Please use the {correctPage} page instead.",
            goToCorrectPage: "Go to Correct Page",
            stayHere: "Stay Here",
            customerSignIn: "Customer Sign In",
            eventAdminSignIn: "Event Admin Sign In"
        },
        adminEvent: {
            title: "Event Admin Hub of",
            subtitle: "- Share your events with the world!"
        },
        userTypes: {
            customer: "Customer",
            eventAdmin: "Event Admin",
            unknown: "Unknown"
        }
    },
    id: {
        common: {
            signin: "Masuk",
            signup: "Daftar",
            register: "Daftar",
            email: "Email",
            username: "Nama Pengguna",
            password: "Kata Sandi",
            forgotPassword: "Lupa kata sandi?",
            dontHaveAccount: "Belum punya akun?",
            registerHere: "Daftar di sini",
            loading: "Memuat...",
            submit: "Kirim",
            cancel: "Batal",
            confirm: "Konfirmasi",
            success: "Berhasil",
            error: "Error",
            warning: "Peringatan"
        },
        signin: {
            title: "Temukan Pantai Indonesia yang Menakjubkan dengan",
            subtitle: "– Coba rekomendasi kami sekarang!",
            emailOrUsernamePlaceholder: "Masukkan email atau nama pengguna",
            passwordPlaceholder: "Kata Sandi",
            signinButton: "Masuk",
            eventAdminQuestion: "Apakah Anda penyelenggara acara?",
            eventAdminButton: "Masuk di sini!",
            successTitle: "Berhasil Masuk!",
            successMessage: "Selamat datang kembali di Oceanique!",
            failedTitle: "Gagal Masuk!",
            failedMessage: "Login gagal",
            wrongPageTitle: "Halaman Masuk Salah",
            wrongPageMessage: "Anda mencoba masuk sebagai {userType}, tetapi Anda berada di halaman masuk yang salah. Silakan gunakan halaman {correctPage}.",
            goToCorrectPage: "Ke Halaman yang Benar",
            stayHere: "Tetap di Sini",
            customerSignIn: "Masuk Pelanggan",
            eventAdminSignIn: "Masuk Admin Acara"
        },
        adminEvent: {
            title: "Hub Admin Acara",
            subtitle: "- Bagikan acara Anda dengan dunia!"
        },
        userTypes: {
            customer: "Pelanggan",
            eventAdmin: "Admin Acara",
            unknown: "Tidak Diketahui"
        }
    }
};

interface I18nProviderProps {
    children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        // Get saved language from localStorage or default to 'en'
        const saved = localStorage.getItem('oceanique-language') as Language;
        return saved && saved in SUPPORTED_LANGUAGES ? saved : 'en';
    });
    const [isLoading, setIsLoading] = useState(false);

    // Save language preference to localStorage
    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('oceanique-language', lang);
    };

    // Translation function with parameter interpolation
    const t = (key: string, params?: Record<string, string>): string => {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
            value = value?.[k];
        }

        if (typeof value !== 'string') {
            console.warn(`Translation key "${key}" not found for language "${language}"`);
            return key; // Return the key if translation not found
        }

        // Replace parameters in the string
        if (params) {
            return value.replace(/\{(\w+)\}/g, (match: string, param: string) => {
                return params[param] || match;
            });
        }

        return value;
    };

    const contextValue: I18nContextType = {
        language,
        setLanguage,
        t,
        isLoading
    };

    return (
        <I18nContext.Provider value={contextValue}>
            {children}
        </I18nContext.Provider>
    );
};

// Custom hook to use I18n context
export const useI18n = (): I18nContextType => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
};