import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n/config';
import { validateTranslations } from '../i18n/config';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  t: (key: string) => string;
  validateTranslation: (key: string) => boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('ja');

  const changeLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('trippin-language', lang);
  };

  const t = (key: string) => {
    const translation = i18n.t(key);
    
    // In development, show error for missing translations
    if (process.env.NODE_ENV === 'development') {
      if (translation === key || !translation || translation.includes('[MISSING:')) {
        console.error(`❌ Translation missing: "${key}" for language "${currentLanguage}"`);
        return `[MISSING: ${key}]`;
      }
    }
    
    return translation;
  };

  const validateTranslation = (key: string): boolean => {
    const translation = i18n.t(key);
    return translation !== key && translation && !translation.includes('[MISSING:');
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('trippin-language') || 'ja';
    changeLanguage(savedLanguage);
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t, validateTranslation }}>
      {children}
    </LanguageContext.Provider>
  );
};