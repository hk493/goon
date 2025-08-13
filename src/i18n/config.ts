import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources, availableLanguages } from './i18nResources';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ja', // Default language
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Key separator configuration
    keySeparator: '.',
    nsSeparator: ':',
    
    // React specific options
    react: {
      useSuspense: false,
    },
    
    // Detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'trippin-language',
    }
  });

// Validation function for translations
export const validateTranslations = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const requiredKeys = [
    'welcome',
    'subtitle',
    'startJourney',
    'menu.home',
    'menu.dashboard',
    'menu.login',
    'menu.register',
    'menu.terms',
    'menu.privacy',
    'menu.cookies',
    'menu.legalInfo',
    'auth.welcome',
    'auth.login',
    'auth.register',
    'questionnaire.language',
    'questionnaire.basic',
    'questionnaire.style'
  ];

  // Check each language for required keys
  availableLanguages.forEach(lang => {
    const langResources = resources[lang.code as keyof typeof resources]?.translation;
    if (!langResources) {
      errors.push(`Missing translation resources for language: ${lang.code}`);
      return;
    }

    requiredKeys.forEach(key => {
      const value = getNestedValue(langResources, key);
      if (!value || typeof value !== 'string' || value.trim() === '') {
        errors.push(`Missing translation for key "${key}" in language "${lang.code}"`);
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper function to get nested object values
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

// Development validation
if (process.env.NODE_ENV === 'development') {
  const validation = validateTranslations();
  if (!validation.isValid) {
    console.warn('🌐 Translation validation warnings:');
    validation.errors.forEach(error => console.warn(`  - ${error}`));
  } else {
    console.log('✅ All translations validated successfully');
  }
}

export default i18n;
