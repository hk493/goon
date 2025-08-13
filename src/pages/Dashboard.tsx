import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, Clock, Star, Smartphone, MessageCircle, HelpCircle, Languages, Camera, Upload, X, Loader, ArrowLeft, Eye, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTrip } from '../contexts/TripContext';
import { apiCall, API_CONFIG } from '../config/api';
import SEOHead from '../components/SEOHead';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { trips } = useTrip();
  const [showTranslator, setShowTranslator] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' },
    { code: 'ko', name: '한국어' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ru', name: 'Русский' },
    { code: 'ar', name: 'العربية' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'pt', name: 'Português' },
    { code: 'th', name: 'ไทย' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'it', name: 'Italiano' }
  ];

  useEffect(() => {
    // Load trips and check for any stored trip data
    const loadTrips = async () => {
      try {
        // Check if there's a recently generated trip in localStorage
        const recentTripData = localStorage.getItem('trippin-recent-trip');
        if (recentTripData) {
          const recentTrip = JSON.parse(recentTripData);
          console.log('[Dashboard] Found recent trip data:', recentTrip);
          
          // Add to trips if not already present
          const existingTrip = trips.find(t => t.id === recentTrip.id);
          if (!existingTrip) {
            console.log('[Dashboard] Adding recent trip to context');
            // This would ideally be handled by the TripProvider
          }
        }
        
        console.log('[Dashboard] Current trips in context:', trips);
      } catch (error) {
        console.error('[Dashboard] Error loading trips:', error);
      } finally {
        setIsLoadingTrips(false);
      }
    };
    
    loadTrips();
  }, [trips]);

  // Use real trips from context, with enhanced fallback logic
  const displayTrips = React.useMemo(() => {
    console.log('[Dashboard] Computing display trips. Context trips:', trips.length);
    
    if (Array.isArray(trips) && trips.length > 0) {
      console.log('[Dashboard] Using trips from context:', trips);
      return trips.map(trip => ({
        ...trip,
        image: trip.image || 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg'
      }));
    }
    
    // Check for any stored trip data as fallback
    const storedTrips = localStorage.getItem('trippin-trips');
    if (storedTrips) {
      try {
        const parsedTrips = JSON.parse(storedTrips);
        console.log('[Dashboard] Using stored trips:', parsedTrips);
        if (Array.isArray(parsedTrips) && parsedTrips.length > 0) {
          return parsedTrips.map((trip: any) => ({
            ...trip,
            image: trip.image || 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg'
          }));
        }
      } catch (error) {
        console.error('[Dashboard] Error parsing stored trips:', error);
      }
    }
    
    // Final fallback to mock data
    console.log('[Dashboard] Using mock data as final fallback');
    return [
      {
        id: 'mock_1',
        title: t('dashboard.springCherryTrip'),
        destination: t('dashboard.tokyoKyoto'),
        startDate: '2024-04-01',
        endDate: '2024-04-05',
        status: 'upcoming',
        image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg'
      },
      {
        id: 'mock_2',
        title: t('dashboard.osakaGourmetTour'),
        destination: t('dashboard.osaka'),
        startDate: '2024-03-15',
        endDate: '2024-03-18',
        status: 'completed',
        image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg'
      }
    ];
  }, [trips, t]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'ongoing': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return t('dashboard.upcoming');
      case 'ongoing': return t('dashboard.ongoing');
      case 'completed': return t('dashboard.completed');
      default: return t('dashboard.unknown');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleTranslate = async () => {
    if (!imageFile) return;
    
    setIsTranslating(true);
    try {
      // Convert file to base64
      const base64Image = await fileToBase64(imageFile);
      
      const result = await apiCall(API_CONFIG.ENDPOINTS.OPENAI_VISION, {
        method: 'POST',
        body: JSON.stringify({
          image: base64Image,
          targetLanguage: targetLanguage
        })
      });
      
      setTranslatedText(result.translation || 'Translation failed');
    } catch (error) {
      console.error('Image processing error:', error);
      setTranslatedText('Error processing image. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Content = base64String.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = error => reject(error);
    });
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      <SEOHead
        title="ダッシュボード"
        description="あなたの日本旅行プランと予約を一元管理。AIアシスタント、eSIM、翻訳ツールも利用可能。"
        keywords={['旅行管理', 'ダッシュボード', '日本旅行', 'AI旅行プラン']}
      />
      
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Welcome Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {t('dashboard.title')}
          </h2>
          <p className="text-gray-600">
            {t('dashboard.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <motion.div
              className="bg-white rounded-3xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t('dashboard.quickActions')}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <motion.button
                  onClick={() => navigate('/questionnaire/language')}
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-6 h-6" />
                  <span className="font-medium">{t('dashboard.newTripPlan')}</span>
                </motion.button>
                
                <motion.button
                  onClick={() => navigate('/esim')}
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Smartphone className="w-6 h-6" />
                  <span className="font-medium">{t('dashboard.purchaseEsim')}</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Recent Trips */}
            <motion.div
              className="bg-white rounded-3xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">{t('dashboard.yourTrips')}</h3>
                <button className="text-purple-600 hover:text-purple-700 font-medium">
                  {t('dashboard.viewAll')}
                </button>
              </div>

              <div className="space-y-4">
                {displayTrips.map((trip, index) => (
                  <motion.div
                    key={trip.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-2xl hover:border-purple-300 hover:bg-purple-50 transition-all"
                    whileHover={{ scale: 1.01 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <div
                      className="w-16 h-16 bg-cover bg-center rounded-xl"
                      style={{ backgroundImage: `url(${trip.image})` }}
                    />
                    
                    <div className="flex-1 cursor-pointer" onClick={() => navigate(`/trip/${trip.id}`)}>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{trip.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                          {getStatusText(trip.status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{trip.destination}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(trip.startDate).toLocaleDateString('ja-JP')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link
                        to={`/trip/${trip.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="詳細を見る"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/trip/${trip.id}/edit`}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="編集する"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <motion.div
              className="bg-white rounded-3xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">{t('dashboard.statistics')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('dashboard.totalTrips')}</span>
                  <span className="text-2xl font-bold text-purple-600">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('dashboard.visitedCities')}</span>
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('dashboard.totalDays')}</span>
                  <span className="text-2xl font-bold text-green-600">7</span>
                </div>
              </div>
            </motion.div>

            {/* eSIM Status */}
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 border border-blue-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Smartphone className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-800">{t('dashboard.esimStatus')}</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('dashboard.dataRemaining')}</span>
                  <span className="font-medium">2.5GB / 5GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }} />
                </div>
                <p className="text-sm text-gray-600">
                  ✨ 無料プランでは1日目と2日目午前中（12:00まで）の詳細をご覧いただけます
                </p>
              </div>
            </motion.div>

            {/* Support */}
            <motion.div
              className="bg-white rounded-3xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">{t('dashboard.support')}</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/translate')}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Languages className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">{t('dashboard.translation')}</span>
                  </div>
                </button>
                <button 
                  onClick={() => navigate('/chat')}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{t('dashboard.aiChat')}</span>
                  </div>
                </button>
                <button 
                  onClick={() => navigate('/translate?mode=camera')}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Upload className="w-5 h-5 text-indigo-600" />
                    <span className="text-gray-700">{t('dashboard.photoUploadTranslation') || 'Upload & Translate Photo'}</span>
                  </div>
                </button>
                <button 
                  onClick={() => navigate('/translate?mode=camera')}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Camera className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">{t('dashboard.photoTranslation')}</span>
                  </div>
                </button>
                <button
                  onClick={() => setShowTranslator(true)}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-yellow-600" />
                    <span className="text-gray-700">{t('dashboard.helpCenter')}</span>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Photo Translation Modal */}
      <AnimatePresence>
        {showTranslator && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{t('translation.photoTitle') || 'Photo Translation'}</h2>
                <button
                  onClick={() => {
                    setShowTranslator(false);
                    setImageFile(null);
                    setImagePreview(null);
                    setTranslatedText('');
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('translation.targetLanguage') || 'Translate to:'}
                  </label>
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Image Upload */}
                {!imagePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-300 transition-colors"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">{t('translation.dragAndDrop') || 'Drag & drop an image'}</p>
                    <p className="text-sm text-gray-500">{t('translation.orClickToUpload') || 'or click to upload'}</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Uploaded"
                        className="w-full h-auto rounded-xl border border-gray-300"
                      />
                      <button
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    
                    <button
                      onClick={handleTranslate}
                      disabled={isTranslating}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-70"
                    >
                      {isTranslating ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          <span>{t('translation.translating') || 'Translating...'}</span>
                        </>
                      ) : (
                        <>
                          <Languages className="w-5 h-5" />
                          <span>{t('translation.translate') || 'Translate'}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
                
                {/* Translation Result */}
                {translatedText && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('translation.result') || 'Translation Result'}</h3>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="whitespace-pre-wrap">{translatedText}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;