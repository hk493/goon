// Import all language translations
import { ja } from './translations/ja';
import { en } from './translations/en';
import { zh } from './translations/zh';
import { ko } from './translations/ko';
import { es } from './translations/es';
import { fr } from './translations/fr';
import { hi } from './translations/hi';
import { ru } from './translations/ru';
import { ar } from './translations/ar';
import { id } from './translations/id';
import { pt } from './translations/pt';
import { th } from './translations/th';
import { vi } from './translations/vi';
import { it } from './translations/it';

// Consolidated resources object
export const resources = {
  ja: { translation: ja },
  en: { translation: en },
  zh: { translation: zh },
  ko: { translation: ko },
  es: { translation: es },
  fr: { translation: fr },
  hi: { translation: hi },
  ru: { translation: ru },
  ar: { translation: ar },
  id: { translation: id },
  pt: { translation: pt },
  th: { translation: th },
  vi: { translation: vi },
  it: { translation: it }
};

// Export individual translations for direct access if needed
export {
  ja,
  en,
  zh,
  ko,
  es,
  fr,
  hi,
  ru,
  ar,
  id,
  pt,
  th,
  vi,
  it
};

// Available languages configuration
export const availableLanguages = [
  { code: 'ja', name: '日本語', nameEn: 'Japanese', flag: 'jp', country: 'Japan' },
  { code: 'en', name: 'English', nameEn: 'English', flag: 'us', country: 'United States' },
  { code: 'zh', name: '中文', nameEn: 'Chinese', flag: 'cn', country: 'China' },
  { code: 'ko', name: '한국어', nameEn: 'Korean', flag: 'kr', country: 'South Korea' },
  { code: 'es', name: 'Español', nameEn: 'Spanish', flag: 'es', country: 'Spain' },
  { code: 'fr', name: 'Français', nameEn: 'French', flag: 'fr', country: 'France' },
  { code: 'hi', name: 'हिन्दी', nameEn: 'Hindi', flag: 'in', country: 'India' },
  { code: 'ru', name: 'Русский', nameEn: 'Russian', flag: 'ru', country: 'Russia' },
  { code: 'ar', name: 'العربية', nameEn: 'Arabic', flag: 'sa', country: 'Saudi Arabia' },
  { code: 'id', name: 'Bahasa Indonesia', nameEn: 'Indonesian', flag: 'id', country: 'Indonesia' },
  { code: 'pt', name: 'Português', nameEn: 'Portuguese', flag: 'pt', country: 'Portugal' },
  { code: 'th', name: 'ไทย', nameEn: 'Thai', flag: 'th', country: 'Thailand' },
  { code: 'vi', name: 'Tiếng Việt', nameEn: 'Vietnamese', flag: 'vn', country: 'Vietnam' },
  { code: 'it', name: 'Italiano', nameEn: 'Italian', flag: 'it', country: 'Italy' }
];