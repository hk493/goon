import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, ArrowLeft, Edit, Sparkles, Calendar, MapPin, Users, DollarSign, Clock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    // Load all form data from localStorage
    const basicInfo = JSON.parse(localStorage.getItem('trippin-basic-info') || '{}');
    const travelStyle = JSON.parse(localStorage.getItem('trippin-travel-style') || '{}');
    
    // Create default transportation preferences since we removed the detailed preferences screen
    const detailedPreferences = {
      transportation: ['train', 'walking', 'bus'],
      accommodation: [],
      esim: false,
      support: []
    };
    
    setFormData({
      basicInfo,
      travelStyle,
      detailedPreferences
    });
  }, []);

  const handleGeneratePlan = () => {
    // Save all data and navigate to plan generation
    localStorage.setItem('trippin-complete-data', JSON.stringify(formData));
    navigate('/plan-generation');
  };

  const handleBack = () => {
    navigate('/questionnaire/style'); // Go back to style since we removed detailed preferences
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDuration = () => {
    if (!formData.basicInfo?.startDate || !formData.basicInfo?.endDate) return '';
    const start = new Date(formData.basicInfo.startDate);
    const end = new Date(formData.basicInfo.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays}日間`;
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
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {t('confirmation.title')}
          </motion.h1>
          
          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('confirmation.subtitle')}
          </motion.p>
        </div>

        <motion.div
          className="bg-white rounded-3xl p-8 shadow-xl space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Trip Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {formData.basicInfo?.tripTitle || '日本旅行'}
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{t('confirmation.destination')}:</span> {formData.basicInfo?.destination}
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{t('confirmation.duration')}:</span> {getDuration()}
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{t('confirmation.departureDate')}:</span> {formatDate(formData.basicInfo?.startDate)}
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{t('confirmation.returnDate')}:</span> {formatDate(formData.basicInfo?.endDate)}
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{t('confirmation.travelers')}:</span> {formData.basicInfo?.travelers}人
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{t('confirmation.budget')}:</span> {formData.travelStyle?.budget} {formData.travelStyle?.currency}
                </div>
              </div>
            </div>
          </div>

          {/* Interests */}
          {formData.travelStyle?.interests?.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{t('confirmation.interests')}</h3>
                <button
                  onClick={() => navigate('/questionnaire/style')}
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>{t('confirmation.edit')}</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.travelStyle.interests.map((interest: string) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Transportation */}
          {formData.detailedPreferences?.transportation?.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">交通手段</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.detailedPreferences.transportation.map((transport: string) => (
                  <span
                    key={transport}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                  >
                    {transport}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Support Services */}
          {formData.detailedPreferences?.support?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">サポートサービス</h3>
              <div className="flex flex-wrap gap-2">
                {formData.detailedPreferences.support.map((service: string) => (
                  <span
                    key={service}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* eSIM */}
          {formData.detailedPreferences?.esim && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">eSIMデータプラン</h3>
                  <p className="text-gray-600">日本全国対応・高速データ通信</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-center space-x-8 pt-6">
            <motion.button
              onClick={handleBack}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('confirmation.back')}</span>
            </motion.button>

            <motion.button
              onClick={handleGeneratePlan}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-5 h-5" />
              <span>{t('confirmation.generate')}</span>
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
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Confirmation;