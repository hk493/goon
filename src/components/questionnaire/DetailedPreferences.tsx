import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings, ArrowRight, ArrowLeft, Plane, Hotel, Smartphone, Car, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const DetailedPreferences: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [preferences, setPreferences] = useState({
    transportation: [] as string[],
    accommodation: [] as string[],
    esim: false,
    activities: [] as string[],
    support: [] as string[]
  });

  const transportationOptions = [
    { id: 'shinkansen', name: '新幹線', icon: '🚄', nameEn: 'Shinkansen' },
    { id: 'local-train', name: '在来線', icon: '🚃', nameEn: 'Local Train' },
    { id: 'bus', name: 'バス', icon: '🚌', nameEn: 'Bus' },
    { id: 'rental-car', name: 'レンタカー', icon: '🚗', nameEn: 'Rental Car' },
    { id: 'taxi', name: 'タクシー', icon: '🚕', nameEn: 'Taxi' },
    { id: 'walking', name: '徒歩', icon: '🚶', nameEn: 'Walking' }
  ];

  const accommodationOptions = [
    { id: 'hotel', name: 'ホテル', icon: '🏨', nameEn: 'Hotel' },
    { id: 'ryokan', name: '旅館', icon: '🏯', nameEn: 'Ryokan' },
    { id: 'hostel', name: 'ホステル', icon: '🏠', nameEn: 'Hostel' },
    { id: 'airbnb', name: 'Airbnb', icon: '🏡', nameEn: 'Airbnb' },
    { id: 'capsule', name: 'カプセルホテル', icon: '🛏️', nameEn: 'Capsule Hotel' }
  ];

  const supportOptions = [
    { id: 'booking', name: 'ホテル予約', icon: <Hotel className="w-6 h-6" />, nameEn: 'Hotel Booking' },
    { id: 'flights', name: '航空券予約', icon: <Plane className="w-6 h-6" />, nameEn: 'Flight Booking' },
    { id: 'esim-support', name: 'eSIMサポート', icon: <Smartphone className="w-6 h-6" />, nameEn: 'eSIM Support' },
    { id: 'transport', name: '交通サポート', icon: <Car className="w-6 h-6" />, nameEn: 'Transport Support' },
    { id: 'activities', name: 'アクティビティ予約', icon: '🎯', nameEn: 'Activity Booking' },
    { id: 'translation', name: '翻訳サポート', icon: '🗣️', nameEn: 'Translation Support' }
  ];

  const toggleOption = (category: keyof typeof preferences, optionId: string) => {
    setPreferences(prev => ({
      ...prev,
      [category]: prev[category].includes(optionId)
        ? prev[category].filter(id => id !== optionId)
        : [...prev[category], optionId]
    }));
  };

  const handleNext = () => {
    localStorage.setItem('trippin-detailed-preferences', JSON.stringify(preferences));
    navigate('/questionnaire/confirmation');
  };

  const handleBack = () => {
    navigate('/questionnaire/style');
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
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Settings className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {t('questionnaire.details')}
          </motion.h1>
        </div>

        <motion.div
          className="bg-white rounded-3xl p-8 shadow-xl space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Transportation */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {t('transportation.title')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {transportationOptions.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => toggleOption('transportation', option.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    preferences.transportation.includes(option.id)
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="text-sm font-medium">{t(`transportation.${option.id}`)}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Accommodation */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {t('accommodation.title')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {accommodationOptions.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => toggleOption('accommodation', option.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    preferences.accommodation.includes(option.id)
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="text-sm font-medium">{t(`accommodation.${option.id}`)}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* eSIM */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {t('esim.title')}
            </h3>
            <motion.button
              onClick={() => setPreferences(prev => ({ ...prev, esim: !prev.esim }))}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-300 ${
                preferences.esim
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Smartphone className="w-8 h-8 text-purple-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">{t('esim.planName')}</div>
                    <div className="text-sm text-gray-600">{t('esim.planDescription')}</div>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                  preferences.esim
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-300'
                }`}>
                {preferences.esim && (
                  <Check className="w-4 h-4 text-white" />
                )}
                </div>
              </div>
            </motion.button>
          </div>

          {/* Support Services */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {t('support.title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportOptions.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => toggleOption('support', option.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center space-x-3 ${
                    preferences.support.includes(option.id)
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="text-purple-600">{option.icon}</div>
                  <div className="text-left">
                    <div className="font-medium">{t(`support.${option.id}`)}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
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
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
            <div className="w-3 h-3 bg-purple-500 rounded-full" />
            <div className="w-3 h-3 bg-purple-500 rounded-full" />
            <div className="w-3 h-3 bg-purple-500 rounded-full" />
            <div className="w-3 h-3 bg-purple-500 rounded-full" />
            <div className="w-3 h-3 bg-gray-300 rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DetailedPreferences;