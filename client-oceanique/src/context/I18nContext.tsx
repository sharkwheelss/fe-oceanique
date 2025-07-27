// contexts/I18nContext.tsx

import React, { createContext, useContext, useState } from 'react';
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
            warning: "Warning",
            "locale": "en-US",
            "numberLocale": "en-US"
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
        },
        signup: {
            title: "Your Indonesian Beach Escape Starts Here",
            subtitle: "Join Oceanique Now!",
            emailPlaceholder: "Enter your email",
            usernamePlaceholder: "Enter your username",
            passwordPlaceholder: "Password",
            confirmPasswordPlaceholder: "Confirm Password",
            signupButton: "Sign Up Now",
            successTitle: "Registration Successful!",
            successMessage: "Welcome to Oceanique! Please sign in to continue.",
            failedTitle: "Registration Failed!",
            failedMessage: "An error occurred while registering. Please try again.",
            haveAcc: "Already have an account?",
            signinHere: "Sign in here",
            organizingEvent: "Are you organizing an event?",
            eventAdminSignup: "Sign up as event organizer!",
            adminTitle: "Join Oceanique as an Event Admin",
            adminSubtitle: "– Share your events with the world!"
        },
        logout: {
            title: "Log Out",
            message: "Are you sure you want to log out?",
        },
        home: {
            opening: 'Looking for beach that suits you the most?',
            try: 'Try our recommendation!',
            one: 'Based on Preferences',
            two: 'Matches Your Personality',
            three: 'Updated Reviews',
            trynow: 'Try Now',
            why: 'Why Oceanique?',
            why1: 'Sabang to Merauke',
            why1Desc: 'Find the beach all over Indonesia',
            why2: 'Beach Recommendation',
            why2Desc: 'Find the beach that suits you the most',
            why3: 'Updated Reviews',
            why3Desc: 'Level up your vibe with epic beach events!',
            eventSection: 'All Events at Your Favorite Beaches',
            eventSectionDesc: 'Discover the latest events at your favorite beaches. From music festivals to cultural celebrations, find out what’s happening near you.',
            eventSectionButton: 'See All Events',
        },
        navbar: {
            home: 'Home',
            beaches: 'Beaches',
            events: 'Events',
            wishlist: 'Wishlist',
            transactionHistory: 'Transaction History',
        },
        beaches: {
            search: 'Search Beaches',
            province: 'Province',
            city: 'City',
            subdistrict: 'Subdistrict',
            sortBy: 'Sort By',
            priceRange: 'Price Range',
            near: 'Near You (Within 50km)',
            all: 'All Beaches',
        },
        events: {
            search: 'Search Events',
            province: 'Province',
            city: 'City',
            beach: 'Beach',
            status: 'Status',
            all: 'All Available Events',
        },
        wishlist: {
            title: 'Your Wishlist Beaches',
            desc: ' beach in your wishlist',
            empty: 'Your wishlist is empty. Add some beaches to your wishlist to see them here',
        },
        "transHis": {
            "pending": "Pending",
            "rejected": "Rejected",
            "approved": "Approved",
            "loading": "Loading transactions...",
            "sortBy": "Sort By",
            "yourTickets": "Your Ticket(s)",
            "rejectionReason": "Rejection Reason",
            "transactionRejected": "Transaction Rejected",
            "paymentMethod": "Payment Method",
            "bookedAt": "Booked at",
            "rejectedAt": "Rejected at",
            "approvedAt": "Approved at",
            "total": "Total",
            "qrCodeAlt": "QR Code for booking {{bookingId}}",
            "defaultTicketName": "Ticket",
            "defaultCategory": "General",
            "groupTransactionId": "GRPTRX-{{id}}",
            "transactionId": "IDTRX-{{id}}",
            "ticketQuantity": "{{count}} ticket(s)",
            "noTransactions": "No {{status}} transactions found."
        },
        beachDetail: {
            saveToWishlist: "Save to Wishlist",
            removeFromWishlist: "Remove from Wishlist",
            about: "About",
            facility: "Facilities",
            fotoVideo: "Photos & Videos",
            reviews: "Reviews",
            location: "Location",
            contactPerson: "Contact Person",
            officialWebsite: "Official Website",
            activity: "Activities",
            allFacility: "All Facilities",
            overallRating: "Overall Rating",
            addReview: "Add Review",
        },
        personality: {
            vibes: "What's your vibe? Let's match your personality!",
            extSubtitle: "Still the same person as before?",
            extConfirmButton: "Yep, that's me!",
            extCancelButton: "No, I'm different now",
            newSubtitle: "Are you sure this matches your vibe?",
            newConfirmButton: "Yes, that's me!",
            newCancelButton: "Let me choose again"
        },
        preference: {
            title: "Your beach, your rules! Rank what you care about the most.",
            skip: "Skip for now",
            next: "Next",
            back: "Back",
        },
        questions: {
            back: "Back",
            previous: "Previous",
            next: "Next",
            submit: "Submit",
            single: "Can choose only one",
            multiple: "Can choose multiple",
        },
        result: {
            title: "Our top picks for you!",
            startOver: "Start Over",
            scroll: "Scroll to see the reviews",
            finish: "Finish",
            says: "What People Said",
            review: "Reviews",
            noReviews: "No reviews yet. Be the first to review this beach!",
            match: "Match"
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
            warning: "Peringatan",
            "locale": "id-ID",
            "numberLocale": "id-ID"
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
        },
        signup: {
            title: "Bergabunglah dengan Komunitas Oceanique",
            subtitle: "- Daftar untuk menemukan pantai-pantai indah Indonesia!",
            emailPlaceholder: "Masukkan email Anda",
            usernamePlaceholder: "Masukkan nama pengguna Anda",
            passwordPlaceholder: "Kata Sandi",
            confirmPasswordPlaceholder: "Konfirmasi Kata Sandi",
            signupButton: "Daftar Sekarang",
            successTitle: "Pendaftaran Berhasil!",
            successMessage: "Selamat datang di Oceanique! Silakan masuk untuk melanjutkan.",
            failedTitle: "Pendaftaran Gagal!",
            failedMessage: "Terjadi kesalahan saat mendaftar. Silakan coba lagi.",
            haveAcc: "Sudah punya akun?",
            signinHere: "Masuk di sini",
            organizingEvent: "Apakah Anda mengorganisir acara?",
            eventAdminSignup: "Daftar sebagai Admin Acara",
            adminTitle: "Gabung sebagai Admin Acara Oceanique",
            adminSubtitle: "– Bagikan acara Anda dengan dunia!"
        },
        logout: {
            title: "Keluar",
            message: "Apakah Anda yakin ingin keluar?",
        },
        home: {
            opening: 'Mencari pantai yang paling cocok untukmu?',
            try: 'Coba rekomendasi kami!',
            one: 'Berdasarkan Preferensi',
            two: 'Cocok dengan Kepribadianmu',
            three: 'Ulasan Terbaru',
            trynow: 'Coba Sekarang',
            why: 'Mengapa Oceanique?',
            why1: 'Sabang sampai Merauke',
            why1Desc: 'Temukan pantai di seluruh Indonesia',
            why2: 'Rekomendasi Pantai',
            why2Desc: 'Temukan pantai yang paling cocok untukmu',
            why3: 'Ulasan Terbaru',
            why3Desc: 'Tingkatkan suasana dengan acara pantai yang epik!',
            eventSection: 'Semua Acara di Pantai Favoritmu',
            eventSectionDesc: 'Temukan acara terbaru di pantai favoritmu. Dari festival musik hingga perayaan budaya, cari tahu apa yang terjadi di dekatmu.',
            eventSectionButton: 'Lihat Semua Acara',
        },
        navbar: {
            home: 'Beranda',
            beaches: 'Pantai',
            events: 'Acara',
            wishlist: 'Daftar Keinginan',
            transactionHistory: 'Riwayat Transaksi',
        },
        beaches: {
            search: 'Cari Pantai',
            province: 'Provinsi',
            city: 'Kota',
            subdistrict: 'Kecamatan',
            sortBy: 'Urutkan Berdasarkan',
            priceRange: 'Rentang Harga',
            near: 'Dekat Anda (Dalam 50km)',
            all: 'Semua Pantai',
        },
        events: {
            search: 'Cari Acara',
            province: 'Provinsi',
            city: 'Kota',
            beach: 'Pantai',
            status: 'Status',
            all: 'Semua Acara Tersedia',
        },
        wishlist: {
            title: 'Daftar Keinginan Pantai Anda',
            desc: ' pantai dalam daftar keinginan Anda',
            empty: 'Daftar keinginan Anda kosong. Tambahkan beberapa pantai ke wishlist Anda untuk melihatnya di sini',
        },
        "transHis": {
            "pending": "Menunggu",
            "rejected": "Ditolak",
            "approved": "Disetujui",
            "loading": "Memuat transaksi...",
            "sortBy": "Urutkan Berdasarkan",
            "yourTickets": "Tiket Anda",
            "rejectionReason": "Alasan Penolakan",
            "transactionRejected": "Transaksi Ditolak",
            "paymentMethod": "Metode Pembayaran",
            "bookedAt": "Dipesan pada",
            "rejectedAt": "Ditolak pada",
            "approvedAt": "Disetujui pada",
            "total": "Total",
            "qrCodeAlt": "Kode QR untuk booking {{bookingId}}",
            "defaultTicketName": "Tiket",
            "defaultCategory": "Umum",
            "groupTransactionId": "GRPTRX-{{id}}",
            "transactionId": "IDTRX-{{id}}",
            "ticketQuantity": "{{count}} tiket",
            "noTransactions": "Tidak ada transaksi {{status}} ditemukan."
        },
        beachDetail: {
            saveToWishlist: "Simpan ke Daftar Keinginan",
            removeFromWishlist: "Hapus dari Daftar Keinginan",
            about: "Tentang",
            facility: "Fasilitas",
            fotoVideo: "Foto & Video",
            reviews: "Ulasan",
            location: "Lokasi",
            contactPerson: "Kontak Person",
            officialWebsite: "Situs Resmi",
            activity: "Aktivitas",
            allFacility: "Semua Fasilitas",
            overallRating: "Rating Keseluruhan",
            addReview: "Tambahkan Ulasan",
        },
        personality: {
            vibes: "Apa vibe kamu? Mari cocokkan dengan kepribadianmu!",
            extSubtitle: "Masih orang yang sama seperti sebelumnya?",
            extConfirmButton: "Ya, itu saya!",
            extCancelButton: "Tidak, saya berbeda sekarang",
            newSubtitle: "Apakah kamu yakin ini cocok dengan vibe kamu?",
            newConfirmButton: "Ya, itu saya!",
            newCancelButton: "Biarkan saya memilih lagi"
        },
        preference: {
            title: "Pantai kamu, aturan kamu! Urutkan apa yang paling kamu pedulikan.",
            skip: "Lewati untuk sekarang",
            next: "Selanjutnya",
            back: "Kembali",
        },
        questions: {
            back: "Kembali",
            previous: "Sebelumnya",
            next: "Selanjutnya",
            submit: "Kirim",
            single: "Pilih salah satu",
            multiple: "Pilih beberapa",
        },
        result: {
            title: "Rekomendasi terbaik untukmu!",
            startOver: "Mulai Ulang",
            scroll: "Gulir untuk melihat ulasan",
            finish: "Selesai",
            says: "Apa yang Orang Lain Katakan",
            review: "Ulasan",
            noReviews: "Belum ada ulasan. Jadilah yang pertama mengulas pantai ini!",
            match: "Cocok"
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