import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import GooglePlacesAutocomplete from '../GooglePlacesAutocomplete';

interface PlaceData {
  name: string;
  formatted_address: string;
  place_id?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    }
  };
}

interface FormData {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  tripTitle: string;
  placeData?: PlaceData;
}

interface ValidationErrors {
  tripTitle?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  travelers?: string;
  dateRange?: string;
}

const BasicInfo: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    tripTitle: '',
    placeData: undefined
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Required field validation
    if (!formData.tripTitle.trim()) {
      newErrors.tripTitle = t('errors.tripTitleRequired');
    }

    if (!formData.destination.trim()) {
      newErrors.destination = t('errors.destinationRequired');
    }

    if (!formData.startDate) {
      newErrors.startDate = t('errors.departureDateRequired');
    }

    if (!formData.endDate) {
      newErrors.endDate = t('errors.returnDateRequired');
    }

    if (!formData.travelers || formData.travelers < 1) {
      newErrors.travelers = t('errors.travelersRequired');
    }

    // Date validation
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        newErrors.startDate = t('errors.pastDate');
      }

      if (startDate >= endDate) {
        newErrors.dateRange = t('errors.invalidDateRange');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      // Save form data to context or localStorage
      localStorage.setItem('trippin-basic-info', JSON.stringify(formData));
      navigate('/questionnaire/style');
    }
  };

  const handleBack = () => {
    navigate('/questionnaire/language');
  };

  const handlePlaceSelect = (place: PlaceData) => {
    setFormData({
      ...formData,
      placeData: place,
      destination: place.name
    });
  };

  const popularDestinations = [
    { key: 'tokyo', label: t('destinations.tokyo') },
    { key: 'osaka', label: t('destinations.osaka') },
    { key: 'kyoto', label: t('destinations.kyoto') },
    { key: 'hiroshima', label: t('destinations.hiroshima') },
    { key: 'okinawa', label: t('destinations.okinawa') },
    { key: 'hokkaido', label: t('destinations.hokkaido') },
    { key: 'nara', label: t('destinations.nara') },
    { key: 'kobe', label: t('destinations.kobe') }
  ];

  const ErrorMessage: React.FC<{ message?: string }> = ({ message }) => {
    if (!message) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-red-600 text-sm mt-1"
      >
        <AlertCircle className="w-4 h-4" />
        <span>{message}</span>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MapPin className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {t('questionnaire.basic')}
          </motion.h1>
        </div>

        {/* Form */}
        <motion.div
          className="bg-white rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="space-y-6">
            {/* Trip Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('questionnaire.tripTitle')}
              </label>
              <input
                type="text"
                value={formData.tripTitle}
                onChange={(e) => setFormData({ ...formData, tripTitle: e.target.value })}
                placeholder={t('questionnaire.tripTitlePlaceholder')}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.tripTitle ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <ErrorMessage message={errors.tripTitle} />
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('questionnaire.destination')}
              </label>
              <GooglePlacesAutocomplete
                value={formData.destination}
                onChange={(value) => setFormData({ ...formData, destination: value })}
                onPlaceSelect={handlePlaceSelect}
                placeholder={t('questionnaire.destinationPlaceholder')}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.destination ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <ErrorMessage message={errors.destination} />
              <div className="mt-3 flex flex-wrap gap-2">
                {popularDestinations.map((dest) => (
                  <button
                    key={dest.key}
                    onClick={() => setFormData({ ...formData, destination: dest.label })}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full transition-colors"
                  >
                    {dest.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('questionnaire.departureDate')}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.startDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                <ErrorMessage message={errors.startDate} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('questionnaire.returnDate')}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.endDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                <ErrorMessage message={errors.endDate} />
              </div>
            </div>

            {/* Date Range Error */}
            {errors.dateRange && (
              <ErrorMessage message={errors.dateRange} />
            )}

            {/* Travelers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('questionnaire.travelers')}
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.travelers ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>
                      {num}人 ({num} {num === 1 ? 'person' : 'people'})
                    </option>
                  ))}
                </select>
              </div>
              <ErrorMessage message={errors.travelers} />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
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
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all"
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
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <div className="w-3 h-3 bg-gray-300 rounded-full" />
            <div className="w-3 h-3 bg-gray-300 rounded-full" />
            <div className="w-3 h-3 bg-gray-300 rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BasicInfo;