import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, ArrowLeft, DollarSign } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const TravelStyle: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('jpy');

  const interests = [
    { id: 'history-culture', icon: '🏯' },
    { id: 'anime-manga', icon: '🎌' },
    { id: 'food-gourmet', icon: '🍜' },
    { id: 'nature-scenery', icon: '🌸' },
    { id: 'technology', icon: '🤖' },
    { id: 'fashion', icon: '👘' },
    { id: 'traditional-experience', icon: '🎎' },
    { id: 'nightlife', icon: '🌃' },
    { id: 'shopping', icon: '🛍️' },
    { id: 'temples-shrines', icon: '⛩️' },
    { id: 'hot-springs', icon: '♨️' },
    { id: 'festivals-events', icon: '🎆' }
  ];

  const currencies = [
    { code: 'jpy', symbol: '¥', name: t('currencies.jpy') },
    { code: 'usd', symbol: '$', name: t('currencies.usd') },
    { code: 'eur', symbol: '€', name: t('currencies.eur') },
    { code: 'gbp', symbol: '£', name: t('currencies.gbp') },
    { code: 'cny', symbol: '¥', name: t('currencies.cny') },
    { code: 'krw', symbol: '₩', name: t('currencies.krw') }
  ];

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleNext = () => {
    const styleData = {
      interests: selectedInterests,
      budget,
      currency
    };
    localStorage.setItem('trippin-travel-style', JSON.stringify(styleData));
    // Skip detailed preferences and go directly to confirmation
    navigate('/questionnaire/confirmation');
  };

  const handleBack = () => {
    navigate('/questionnaire/basic');
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
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-full mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Heart className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {t('questionnaire.style')}
          </motion.h1>
        </div>

        <motion.div
          className="bg-white rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Interests Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {t('questionnaire.interests')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {interests.map((interest, index) => (
                <motion.button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedInterests.includes(interest.id)
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="text-3xl mb-2">{interest.icon}</div>
                  <div className="text-sm font-medium">{t(`questionnaire.${interest.id}`)}</div>
                </motion.button>
              ))}
            </div>
            
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setSelectedInterests(interests.map(i => i.id))}
                className="text-sm text-pink-600 hover:text-pink-700 transition-colors"
              >
                {t('questionnaire.selectAll')}
              </button>
              <button
                onClick={() => setSelectedInterests([])}
                className="text-sm text-gray-600 hover:text-gray-700 transition-colors"
              >
                {t('questionnaire.deselectAll')}
              </button>
            </div>
          </div>

          {/* Budget */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {t('questionnaire.budget')}
            </h3>
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder={t('questionnaire.budgetPlaceholder')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              >
                {currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <motion.button
              onClick={handleBack}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('back')}</span>
            </motion.button>

            <motion.button
              onClick={handleNext}
              disabled={selectedInterests.length === 0}
              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-medium transition-all ${
                selectedInterests.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white'
              }`}
              whileHover={selectedInterests.length > 0 ? { scale: 1.02 } : {}}
              whileTap={selectedInterests.length > 0 ? { scale: 0.98 } : {}}
            >
              <span>{t('next')}</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-pink-500 rounded-full" />
            <div className="w-3 h-3 bg-pink-500 rounded-full" />
            <div className="w-3 h-3 bg-pink-500 rounded-full" />
            <div className="w-3 h-3 bg-gray-300 rounded-full" />
            <div className="w-3 h-3 bg-gray-300 rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TravelStyle;