import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Language } from '@/services/tourApi';
import translations, { t } from '@/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  getLanguageLabel: (lang: Language) => string;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LANGUAGES = {
  ko: { label: '한국어', flag: '🇰🇷' },
  en: { label: 'English', flag: '🇺🇸' },
  ja: { label: '日本語', flag: '🇯🇵' },
  zh: { label: '中文', flag: '🇨🇳' },
  de: { label: 'Deutsch', flag: '🇩🇪' },
  fr: { label: 'Français', flag: '🇫🇷' }
} as const;

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('ko');

  const getLanguageLabel = (lang: Language): string => {
    return LANGUAGES[lang]?.label || lang;
  };

  const translate = useCallback((key: string): string => {
    // Direct access to translations
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    // Fallback to Korean
    if (language !== 'ko' && translations.ko[key]) {
      return translations.ko[key];
    }
    // If translation not found, return the key
    return key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, getLanguageLabel, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};