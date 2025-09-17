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

/**
 * LANGUAGES
 * - 지원하는 언어 목록과 레이블/아이콘을 정의합니다.
 * - UI에서 언어 선택기 등에 사용됩니다.
 */
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
  // 현재 선택된 언어 상태
  const [language, setLanguage] = useState<Language>('ko');

  /**
   * getLanguageLabel
   * - 주어진 언어 코드에 대응하는 UI용 레이블을 반환합니다.
   */
  const getLanguageLabel = (lang: Language): string => {
    return LANGUAGES[lang]?.label || lang;
  };

  /**
   * translate
   * - 단순 키-값 기반 번역 함수입니다.
   * - 프로젝트가 커지면 i18n 라이브러리 도입을 권장합니다.
   */
  const translate = useCallback((key: string): string => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    // 한글(ko)로 폴백
    if (language !== 'ko' && translations.ko[key]) {
      return translations.ko[key];
    }
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