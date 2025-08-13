import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2 as Hotel, Plane, Car, Check, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BookingOptionsProps {
  onComplete: () => void;
}

const BookingOptions: React.FC<BookingOptionsProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    JSON.parse(localStorage.getItem('trippin-booking-needs') || '[]')
  );

  const bookingOptions = [
    { id: 'hotel', name: t('booking.hotel'), icon: Hotel, description: t('booking.hotelDescription') },
    { id: 'flight', name: t('booking.flight'), icon: Plane, description: t('booking.flightDescription') },
    { id: 'car', name: t('booking.car'), icon: Car, description: t('booking.carDescription') }
  ];

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleContinue = () => {
    // Save selected booking options
    localStorage.setItem('trippin-booking-options', JSON.stringify(selectedOptions));
    localStorage.removeItem('trippin-booking-needs');
    
    // Redirect based on selection
    if (selectedOptions.includes('hotel')) {
      navigate('/bookings');
    } else {
      // If no hotel booking, go to dashboard
      onComplete();
    }
  };

  const handleSkip = () => {
    // Skip booking and go to dashboard
    onComplete();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 max-w-2xl w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('booking.title')}</h2>
        <p className="text-gray-600 mb-6">{t('booking.subtitle')}</p>
        
        <div className="space-y-4 mb-8">
          {bookingOptions.map((option) => (
            <motion.div
              key={option.id}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedOptions.includes(option.id)
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
              }`}
              onClick={() => toggleOption(option.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedOptions.includes(option.id)
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <option.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{option.name}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedOptions.includes(option.id)
                    ? 'border-purple-500 bg-purple-500 text-white'
                    : 'border-gray-300'
                }`}>
                  {selectedOptions.includes(option.id) && <Check className="w-4 h-4" />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={handleSkip}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5" />
            <span>{t('booking.skip')}</span>
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <Check className="w-5 h-5" />
            <span>{t('booking.continue')}</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingOptions;