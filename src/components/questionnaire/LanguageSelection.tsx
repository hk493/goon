import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { availableLanguages } from '../../i18n/i18nResources';

const LanguageSelection: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage, changeLanguage, t } = useLanguage();

  const handleLanguageSelect = (langCode: string) => {
    changeLanguage(langCode);
    setTimeout(() => {
      navigate('/questionnaire/basic');
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        className="max-w-4xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Globe className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {t('questionnaire.language')}
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Choose your preferred language for the best experience
          </motion.p>
        </div>

        {/* Language Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto pr-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {availableLanguages.map((lang, index) => (
            <motion.button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`group relative bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                currentLanguage === lang.code
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src={`https://flagcdn.com/w80/${lang.flag}.png`} 
                    alt={`${lang.country} flag`}
                    className="w-12 h-8 object-cover rounded-md transform group-hover:scale-110 transition-transform"
                  />
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-800">{lang.name}</h3>
                    <p className="text-gray-500 text-sm">{lang.nameEn}</p>
                    <p className="text-gray-400 text-xs mt-1">{lang.country}</p>
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <ArrowRight className={`w-6 h-6 transition-all duration-300 ${
                    currentLanguage === lang.code
                      ? 'text-blue-500 translate-x-2'
                      : 'text-gray-400 group-hover:text-blue-500 group-hover:translate-x-2'
                  }`} />
                </div>
              </div>

              {currentLanguage === lang.code && (
                <motion.div
                  className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          ))}
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <div className="w-3 h-3 bg-gray-300 rounded-full" />
            <div className="w-3 h-3 bg-gray-300 rounded-full" />
            <div className="w-3 h-3 bg-gray-300 rounded-full" />
            <div className="w-3 h-3 bg-gray-300 rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LanguageSelection;