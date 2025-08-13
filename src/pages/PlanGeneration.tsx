import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, MapPin, Users, DollarSign, Clock, Check, Download, Share2, Star, Car, Hotel, Plane } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTrip } from '../contexts/TripContext';
import { apiCall, API_CONFIG, APIError } from '../config/api';
import { handleAWSError, handleOpenAIError, autoRecovery, globalErrorHandler } from '../utils/errorHandler';
import MockDataNotice from '../components/MockDataNotice';

// Debug logging helper
const logDebug = (message: string, data?: any) => {
  console.log(`[PlanGeneration] ${message}`, data || '');
};

const PlanGeneration: React.FC = () => {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const { isAuthenticated, isPremium } = useAuth();
  const { createTrip } = useTrip();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [generatedPlans, setGeneratedPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [limitedPlan, setLimitedPlan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMockNotice, setShowMockNotice] = useState(false);
  const [selectedActivityForReview, setSelectedActivityForReview] = useState<any>(null);
  const [activityReviews, setActivityReviews] = useState<any>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  useEffect(() => {
    const tripData = JSON.parse(localStorage.getItem('trippin-complete-data') || '{}');
    logDebug('Loaded trip data from localStorage', tripData);
    generatePlan(tripData);
  }, []);

  const generatePlan = async (tripData: any) => {
    setIsLoading(true);
    setProgress(0);
    logDebug('Starting plan generation process');
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (Math.floor(newProgress / 10) > Math.floor(prev / 10)) {
          logDebug(`Progress: ${Math.floor(newProgress)}%`);
        }
        return newProgress > 95 ? 95 : newProgress;
      });
    }, 1000);
    
    try {
      logDebug('Preparing to call OpenAI generate function');
      
      // Log the request payload for debugging
      const result = await apiCall(API_CONFIG.ENDPOINTS.OPENAI_GENERATE, {
        method: 'POST',
        body: JSON.stringify({ 
          tripData: { ...tripData, language: currentLanguage, generateMultiplePlans: true }
        })
      });


      logDebug('Received result from API', result);
      
      if (result.success) {
        // Check if this is mock data
        if (result.isMockData) {
          setShowMockNotice(true);
        }
        
        // Handle multiple plans or single plan
        if (Array.isArray(result.data)) {
          setGeneratedPlans(result.data);
          setSelectedPlan(result.data[0]);
        } else {
          setGeneratedPlans([result.data]);
          setSelectedPlan(result.data);
        }
        logDebug('Plans generated successfully', result.data);
        
        // Create a limited version of the plan for free users
        const planToLimit = Array.isArray(result.data) ? result.data[0] : result.data;
        if (planToLimit && planToLimit.itinerary && planToLimit.itinerary.length > 0) {
          const createLimitedPlan = (fullPlan: any) => {
            const limitedItinerary = [];
            
            console.log('[PlanGeneration] Creating limited plan from:', fullPlan);
            
            // Day 1: Show all activities
            if (fullPlan.itinerary[0]) {
              limitedItinerary.push({
                ...fullPlan.itinerary[0],
                isFullDay: true
              });
              console.log('[PlanGeneration] Added Day 1 (full day):', fullPlan.itinerary[0]);
            }
            
            // Day 2: Show only morning activities (before 12:00)
            if (fullPlan.itinerary.length > 1 && fullPlan.itinerary[1]?.activities) {
              const day2 = fullPlan.itinerary[1];
              const morningActivities = day2.activities.filter((activity: any) => {
                const time = activity.time || '00:00';
                const hour = parseInt(time.split(':')[0]);
                const isMorning = hour < 12;
                console.log(`[PlanGeneration] Activity "${activity.name}" at ${time}: ${isMorning ? 'MORNING' : 'AFTERNOON'}`);
                return isMorning;
              });
              
              const afternoonActivities = day2.activities.filter((activity: any) => {
                const time = activity.time || '00:00';
                const hour = parseInt(time.split(':')[0]);
                return hour >= 12;
              });
              
              if (morningActivities.length > 0) {
                limitedItinerary.push({
                  ...day2,
                  activities: morningActivities,
                  hasAfternoonActivities: afternoonActivities.length > 0,
                  afternoonCount: afternoonActivities.length,
                  isPartialDay: true
                });
                console.log(`[PlanGeneration] Added Day 2 morning: ${morningActivities.length} activities, ${afternoonActivities.length} afternoon activities hidden`);
              }
            }
            
            // Count remaining days
            const remainingDays = fullPlan.itinerary.length - 2;
            
            const limitedPlan = {
              ...fullPlan,
              itinerary: limitedItinerary,
              isLimited: true,
              remainingDays: remainingDays > 0 ? remainingDays : 0,
              totalDays: fullPlan.itinerary.length
            };
            
            console.log('[PlanGeneration] Limited plan created:', {
              originalDays: fullPlan.itinerary.length,
              limitedDays: limitedItinerary.length,
              remainingDays: limitedPlan.remainingDays
            });
            
            return limitedPlan;
          };
          
          const limitedPlanData = createLimitedPlan(result.data);
          setLimitedPlan(limitedPlanData);
        }
        
        // Create trip in context
        const newTrip = {
          id: `trip_${Date.now()}`,
          title: tripData.basicInfo?.tripTitle || selectedPlan.destination,
          destination: selectedPlan.destination,
          startDate: tripData.basicInfo?.startDate,
          endDate: tripData.basicInfo?.endDate,
          itinerary: selectedPlan.itinerary,
          budget: parseInt(tripData.travelStyle?.budget || '0'),
          currency: tripData.travelStyle?.currency || 'JPY',
          travelers: tripData.basicInfo?.travelers || 1,
          interests: tripData.travelStyle?.interests || [],
          status: 'upcoming',
          image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        logDebug('Creating trip in context', newTrip);
        const createdTrip = await createTrip(newTrip);
        logDebug('Trip created in context');
        
        // Store the recent trip for dashboard access
        localStorage.setItem('trippin-recent-trip', JSON.stringify(createdTrip));
        console.log('[PlanGeneration] Stored recent trip for dashboard access');
        
      } else {
        throw new Error(result.message || 'プラン生成に失敗しました');
      }
    } catch (error) {
      const apiError = error as APIError;
      
      // Log error with context
      globalErrorHandler.handleError(apiError, {
        page: 'PlanGeneration',
        action: 'generatePlan',
        userAgent: navigator.userAgent,
        url: window.location.href
      });
      
      logDebug('Error caught during plan generation', apiError);
      
      // Handle specific errors
      if (apiError.code === 'TIMEOUT' || apiError.status === 504) {
        const errorInfo = handleOpenAIError(apiError);
        setError(errorInfo.message);
        
        // Try to load template plan as fallback
        try {
          const fallbackPlan = await autoRecovery.handleServiceFailure('openai');
          if (fallbackPlan.data) {
            setGeneratedPlan(fallbackPlan.data);
            setShowBookingPrompt(true);
            return;
          }
        } catch (fallbackError) {
          console.error('Fallback plan failed:', fallbackError);
        }
      } else if (apiError.status === 429) {
        setError('AI処理が混雑しています。2-3分待ってからお試しください。');
      } else if (apiError.status && apiError.status >= 500) {
        setError('サーバーで問題が発生しています。しばらく待ってからお試しください。');
      } else if (apiError.code === 'NETWORK_OFFLINE') {
        setError('インターネット接続がありません。接続を確認してください。');
      } else {
        const errorInfo = handleAWSError(apiError);
        setError(errorInfo.message);
      }
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setIsLoading(false);
      logDebug('Plan generation process completed');
    }
  };

  const fetchActivityReviews = async (activity: any) => {
    setSelectedActivityForReview(activity);
    setIsLoadingReviews(true);
    
    try {
      const result = await apiCall('/tripadvisor', {
        method: 'POST',
        body: JSON.stringify({
          location: activity.name,
          language: currentLanguage
        })
      });
      
      if (result.success && result.data) {
        setActivityReviews(result.data);
        
        // Open TripAdvisor or Google Maps reviews
        if (result.data[0]?.web_url) {
          window.open(result.data[0].web_url, '_blank');
        } else {
          // Fallback to Google Maps reviews
          const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(activity.name + ' ' + activity.location)}/`;
          window.open(googleMapsUrl, '_blank');
        }
      } else {
        throw new Error('レビュー情報の取得に失敗しました');
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      // Fallback to Google Maps
      const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(activity.name + ' ' + activity.location)}/`;
      window.open(googleMapsUrl, '_blank');
    } finally {
      setIsLoadingReviews(false);
      setSelectedActivityForReview(null);
    }
  };

  const handleViewPlan = () => {
    logDebug('Navigating to dashboard');
    navigate('/dashboard');
  };

  const handleUpgrade = () => {
    navigate('/checkout');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('planGeneration.error')}</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/questionnaire/confirmation')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            {t('planGeneration.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {isLoading ? t('planGeneration.title') : t('planGeneration.complete')}
          </h1>
          <p className="text-lg text-gray-600">
            {isLoading ? t('planGeneration.subtitle') : t('planGeneration.completeSubtitle')}
          </p>
        </motion.div>
        
        {/* Mock Data Notice */}
        {showMockNotice && !isLoading && (
          <MockDataNotice 
            onRetry={() => setShowMockNotice(false)}
            className="max-w-4xl mx-auto mb-4"
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            className="bg-white rounded-3xl shadow-lg p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div
                className="absolute inset-0 rounded-full border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent"
                style={{ transform: `rotate(${progress * 3.6}deg)` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">{Math.round(progress)}%</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('planGeneration.generating')}</h2>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <div className="text-left">
                  <div className="h-2 bg-purple-200 rounded-full w-full">
                    <div
                      className="h-2 bg-purple-600 rounded-full"
                      style={{ width: `${Math.min(progress * 1.5, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{t('planGeneration.step1')}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-blue-600" />
                <div className="text-left">
                  <div className="h-2 bg-blue-200 rounded-full w-full">
                    <div
                      className="h-2 bg-blue-600 rounded-full"
                      style={{ width: `${Math.max(0, Math.min((progress - 30) * 1.5, 100))}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{t('planGeneration.step2')}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-green-600" />
                <div className="text-left">
                  <div className="h-2 bg-green-200 rounded-full w-full">
                    <div
                      className="h-2 bg-green-600 rounded-full"
                      style={{ width: `${Math.max(0, Math.min((progress - 60) * 2.5, 100))}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{t('planGeneration.step3')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {!isLoading && selectedPlan && (
          <>
            {/* Plan Selection */}
            {generatedPlans.length > 1 && (
              <motion.div
                className="bg-white rounded-3xl shadow-lg p-6 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">あなたにおすすめの3つのプラン</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {generatedPlans.map((plan, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPlan(plan)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedPlan === plan
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      <h4 className="font-bold text-gray-800 mb-2">{plan.theme}</h4>
                      <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                      <div className="text-sm text-purple-600 font-medium">{plan.totalEstimatedCost}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

          <motion.div
            className="bg-white rounded-3xl shadow-lg overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedPlan.destination}</h2>
                  <p className="text-purple-100">{selectedPlan.duration} • {selectedPlan.totalEstimatedCost}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('planGeneration.days')}</p>
                    <p className="font-semibold text-gray-800">{selectedPlan.itinerary.length} {t('planGeneration.daysCount')}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('planGeneration.budget')}</p>
                    <p className="font-semibold text-gray-800">{selectedPlan.totalEstimatedCost}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('planGeneration.highlights')}</h3>
                
                <div className="space-y-3">
                  {(isPremium ? selectedPlan : limitedPlan)?.itinerary?.map((day: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <p className="font-medium text-gray-800">{day.title}</p>
                          {!isPremium && day.isPartialDay && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                              午前のみ
                            </span>
                          )}
                        </div>
                        <div className="space-y-2 mt-2">
                          {day.activities?.map((activity: any, actIndex: number) => (
                            <div key={actIndex} className="flex items-start space-x-2">
                              <div className="text-sm font-medium text-purple-600 w-16 bg-purple-50 rounded-lg px-2 py-1">{activity.time}</div>
                              <div className="flex-1">
                                <p className="text-base font-semibold text-gray-800 mb-1">{activity.name}</p>
                                {activity.description && (
                                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                                )}
                                <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600 mb-2">
                                  <MapPin className="w-3 h-3" />
                                  <span>{activity.location}</span>
                                  {activity.rating && (
                                    <div className="flex items-center space-x-1">
                                      <Star className="w-3 h-3 text-yellow-500" />
                                      <span>{activity.rating}</span>
                                    </div>
                                  )}
                                  {activity.duration && (
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{activity.duration}分</span>
                                    </div>
                                  )}
                                  {activity.estimatedCost && (
                                    <div className="flex items-center space-x-1">
                                      <DollarSign className="w-3 h-3" />
                                      <span>{activity.estimatedCost}</span>
                                    </div>
                                  )}
                                  {/* Navigation Button */}
                                  {activity.coordinates && (
                                    <div className="flex space-x-2">
                                    <button
                                      onClick={() => {
                                        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${activity.coordinates.lat},${activity.coordinates.lng}&travelmode=transit`;
                                        window.open(googleMapsUrl, '_blank');
                                      }}
                                      className="flex items-center space-x-1 px-2 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-xs"
                                    >
                                      <MapPin className="w-3 h-3" />
                                      <span>向かう</span>
                                    </button>
                                    <button
                                      onClick={() => fetchActivityReviews(activity)}
                                      disabled={isLoadingReviews && selectedActivityForReview?.name === activity.name}
                                      className="flex items-center space-x-1 px-2 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors text-xs disabled:opacity-50"
                                    >
                                      <Star className="w-3 h-3" />
                                      <span>
                                        {isLoadingReviews && selectedActivityForReview?.name === activity.name 
                                          ? '読込中...' 
                                          : 'レビュー'
                                        }
                                      </span>
                                    </button>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Transport Details */}
                                {activity.transportDetails && (
                                  <div className="mt-2 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                                    <div className="flex items-center space-x-4 text-xs text-green-700">
                                      <span>🚃 {activity.transportDetails.method}</span>
                                      <span>📍 {activity.transportDetails.distance || activity.transportDetails.line}</span>
                                      {activity.transportDetails.transfers !== undefined && (
                                        <span>🔄 乗換{activity.transportDetails.transfers}回</span>
                                      )}
                                      <span>🚶 徒歩{activity.transportDetails.walkingTime}</span>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Reviews */}
                                {activity.reviews && activity.reviews.length > 0 && (
                                  <div className="mt-2 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                                    <div className="flex items-start space-x-2">
                                      <Star className="w-4 h-4 text-yellow-500 mt-0.5" />
                                      <div>
                                        <p className="text-xs text-yellow-800 font-medium">"{activity.reviews[0].text}"</p>
                                        <p className="text-xs text-yellow-600 mt-1">- {activity.reviews[0].author}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {activity.tips && (
                                  <div className="mt-2 p-2 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                    <p className="text-xs text-blue-700">💡 {activity.tips}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )) || []}
                          
                          {/* 2日目の午後以降の簡潔な案内 */}
                          {!isPremium && day.isPartialDay && day.hasAfternoonActivities && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Sparkles className="w-6 h-6 text-purple-600" />
                                  <div>
                                    <p className="text-sm font-medium text-purple-800">
                                      午後も{day.afternoonCount}つの素晴らしいスポットがあります
                                    </p>
                                    <p className="text-xs text-purple-600">
                                      プレミアムで完全な1日を体験
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={handleUpgrade}
                                  className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                  詳細を見る
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )) || []}
                  
                  {/* 残りの日程制限メッセージ */}
                  {!isPremium && limitedPlan?.remainingDays > 0 && (
                    <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                          <Calendar className="w-8 h-8 text-blue-600" />
                          <span className="text-xl font-bold text-gray-800">
                            さらに{limitedPlan.remainingDays}日間の冒険が待っています
                          </span>
                        </div>
                        <p className="text-gray-700 mb-6">
                          この{limitedPlan.totalDays}日間の旅程には、まだまだ素晴らしい体験が詰まっています。
                          京都の伝統文化、大阪のグルメ、そして隠れた名所まで...
                        </p>
                        <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <MapPin className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="font-medium text-gray-800">15+スポット</p>
                            <p className="text-gray-600">厳選された場所</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Star className="w-6 h-6 text-green-600" />
                            </div>
                            <p className="font-medium text-gray-800">4.8+評価</p>
                            <p className="text-gray-600">高評価スポット</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Clock className="w-6 h-6 text-purple-600" />
                            </div>
                            <p className="font-medium text-gray-800">最適化済み</p>
                            <p className="text-gray-600">効率的なルート</p>
                          </div>
                        </div>
                        <button
                          onClick={handleUpgrade}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                        >
                          完全な{limitedPlan.totalDays}日間の冒険を始める
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!isPremium && limitedPlan && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-sm text-gray-500 text-center mb-4">
                    🎌 現在、{limitedPlan.totalDays}日間の旅程のうち、最初の2日間をお楽しみいただけます。
                    {limitedPlan.remainingDays > 0 && `さらに${limitedPlan.remainingDays}日間の特別な体験が待っています。`}
                  </p>
                </div>
              )}
              
              <div className="mt-8">
                <button
                  onClick={handleViewPlan}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  <Check className="w-5 h-5" />
                  <span>{t('planGeneration.viewPlan')}</span>
                </button>
                
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full mt-4 flex items-center justify-center space-x-2 bg-white border-2 border-purple-600 text-purple-600 py-3 rounded-xl hover:bg-purple-50 transition-all"
                >
                  <span>ダッシュボードに戻る</span>
                </button>
              </div>
            </div>
          </motion.div>
            </>
        )}
      </div>
    </div>
  );
};

export default PlanGeneration;