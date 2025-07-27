// components/LanguageSwitcher.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useI18n, SUPPORTED_LANGUAGES } from '../../context/I18nContext';
import type { Language } from '../../context/I18nContext';

interface LanguageSwitcherProps {
    className?: string;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
    className = '',
    position = 'inline'
}) => {
    const { language, setLanguage } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
        setIsOpen(false);
    };

    // Position classes for floating positions
    const getPositionClasses = () => {
        if (position === 'inline') return '';

        const baseClasses = 'fixed z-50';
        switch (position) {
            case 'top-right':
                return `${baseClasses} top-4 right-4`;
            case 'top-left':
                return `${baseClasses} top-4 left-4`;
            case 'bottom-right':
                return `${baseClasses} bottom-4 right-4`;
            case 'bottom-left':
                return `${baseClasses} bottom-4 left-4`;
            default:
                return '';
        }
    };

    // Language flags/icons
    const getLanguageDisplay = (lang: Language) => {
        const displays = {
            en: { flag: '🇺🇸', short: 'EN', full: 'English' },
            id: { flag: '🇮🇩', short: 'ID', full: 'Bahasa Indonesia' }
        };
        return displays[lang];
    };

    const currentDisplay = getLanguageDisplay(language);

    return (
        <div className={`relative ${getPositionClasses()} ${className}`} ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <span className="text-lg">{currentDisplay.flag}</span>
                <span className="text-sm font-medium text-gray-700">{currentDisplay.short}</span>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                    {Object.entries(SUPPORTED_LANGUAGES).map(([lang, name]) => {
                        const langKey = lang as Language;
                        const display = getLanguageDisplay(langKey);
                        const isSelected = language === langKey;

                        return (
                            <button
                                key={lang}
                                onClick={() => handleLanguageChange(langKey)}
                                className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${isSelected ? 'bg-teal-50 text-teal-600' : 'text-gray-700'
                                    }`}
                            >
                                <span className="text-lg">{display.flag}</span>
                                <span className="flex-1 text-left">{display.full}</span>
                                {isSelected && (
                                    <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;