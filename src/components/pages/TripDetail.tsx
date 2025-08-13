import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Star, Edit, Share, Download, Info, Users, ExternalLink, Globe, Languages, X, Loader, Sparkles, Lock, Eye } from 'lucide-react';
import { useTrip } from '../contexts/TripContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { apiCall, API_CONFIG, buildApiUrl, APIError } from '../config/api';
import { handleAWSError, autoRecovery, globalErrorHandler } from '../utils/errorHandler';
import MockDataNotice from '../components/MockDataNotice';

const TripDetail: React.FC = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips } = useTrip();
  const { t } = useLanguage();
  const { isPremium } = useAuth();
  const [trip, setTrip] = useState<any>(null);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [activityDetails, setActivityDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showTranslator, setShowTranslator] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [textToTranslate, setTextToTranslate] = useState('');
  const [showMockNotice, setShowMockNotice] = useState(false);

  // Mock trip data
  useEffect(() => {
    const foundTrip = trips.find(t => t.id === tripId);
    if (foundTrip) {
      setTrip(foundTrip);
    } else {
      // Fallback to mock data if not found in context
      const mockTrip = {
        id: tripId,
        title: '春の桜旅',
        destination: '東京・京都',
        startDate: '2024-04-01',
        endDate: '2024-04-05',
        status: 'upcoming',
        image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg',
        itinerary: [
          {
            day: 1,
            date: '2024-04-01',
            title: '東京到着・浅草探索',
            activities: [
              { time: '10:00', name: '羽田空港到着', location: '羽田空港', type: 'transport' },
              { 
                time: '12:00', 
                name: '浅草寺参拝', 
                location: '浅草', 
                type: 'culture', 
                rating: 4.8,
                duration: '90',
                description: '東京最古の寺院で歴史と文化を感じる',
                estimatedCost: '0 JPY',
                tips: '早朝の参拝がおすすめです。混雑を避けられます。'
              },
              { 
                time: '14:00', 
                name: '仲見世通り散策', 
                location: '浅草', 
                type: 'shopping', 
                rating: 4.6,
                duration: '120',
                description: '伝統的なお土産や和菓子を楽しめる商店街',
                estimatedCost: '3000 JPY',
                tips: '人形焼きと雷おこしが名物です。'
              },
              { 
                time: '18:00', 
                name: '天ぷら夕食', 
                location: '浅草', 
                type: 'food', 
                rating: 4.7,
                duration: '90',
                description: '老舗天ぷら店で本格的な江戸前天ぷらを堪能',
                estimatedCost: '4500 JPY',
                tips: '予約推奨。カウンター席がおすすめです。'
              }
            ]
          },
          {
            day: 2,
            date: '2024-04-02',
            title: '渋谷・原宿カルチャー体験',
            activities: [
              { 
                time: '09:00', 
                name: '明治神宮参拝', 
                location: '原宿', 
                type: 'culture', 
                rating: 4.9,
                duration: '90',
                description: '東京の心霊的な中心地で静寂なひとときを',
                estimatedCost: '0 JPY',
                tips: '早朝の参拝が特におすすめです。'
              },
              { 
                time: '11:00', 
                name: '竹下通り散策', 
                location: '原宿', 
                type: 'shopping', 
                rating: 4.5,
                duration: '60',
                description: '若者文化の発信地でユニークなファッションを体験',
                estimatedCost: '5000 JPY',
                tips: '平日の方が混雑が少ないです。'
              },
              { 
                time: '14:00', 
                name: '渋谷スクランブル交差点', 
                location: '渋谷', 
                type: 'sightseeing', 
                rating: 4.8,
                duration: '30',
                description: '世界で最も有名な交差点を体験',
                estimatedCost: '0 JPY',
                tips: 'スターバックス2階からの眺めが最高です。'
              },
              { 
                time: '16:00', 
                name: '渋谷スカイ展望台', 
                location: '渋谷', 
                type: 'sightseeing', 
                rating: 4.7,
                duration: '60',
                description: '東京の絶景を360度楽しめる展望台',
                estimatedCost: '2000 JPY',
                tips: '夕日の時間帯が特に美しいです。'
              }
            ]
          }
        ]
      };
      setTrip(mockTrip);
      setShowMockNotice(true);
    }
  }, [tripId, trips]);
  
  const fetchActivityDetails = async (activity: any) => {
    setIsLoadingDetails(true);
    setSelectedActivity(activity);
    
    try {
      const result = await apiCall('/tripadvisor', {
        method: 'POST',
        body: JSON.stringify({
          location: activity.name
        })
      });
      
      // Check if this is mock data
      if (result.isMockData) {
        setShowMockNotice(true);
      }
      
      // Try to get directions data
      let directionsData = null;
      try {
        const directionsResult = await apiCall('/google-maps', {
          method: 'POST',
          body: JSON.stringify({
            origin: activity.location,
            destination: activity.name,
            type: 'directions'
          })
        });
        directionsData = directionsResult.data || directionsResult;
      } catch (error) {
        console.error('Failed to fetch directions:', error);
      }
      
      setActivityDetails({
        ...(result.data || result),
        directions: directionsData
      });
    } catch (error) {
      const apiError = error as APIError;
      
      // Log error
      globalErrorHandler.handleError(apiError, {
        page: 'TripDetail',
        action: 'fetchActivityDetails',
        userAgent: navigator.userAgent,
        url: window.location.href
      });
      
      console.error('Failed to fetch activity details:', apiError);
      
      // Try fallback data
      try {
        const fallbackData = await autoRecovery.handleServiceFailure('tripadvisor');
        setActivityDetails(fallbackData.data || {
          data: [
            {
              name: activity.name,
              description: 'A popular attraction in Japan.',
              rating: activity.rating || '4.5',
              num_reviews: '1000+',
              photo: {
                images: {
                  original: {
                    url: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg'
                  }
                }
              }
            }
          ],
          reviews: {
            data: [
              {
                title: 'Great experience',
                text: 'Wonderful place to visit. Highly recommended!',
                rating: 5,
                user: { username: 'Traveler123' }
              }
            ]
          }
        });
      } catch (fallbackError) {
        console.error('Fallback data failed:', fallbackError);
        setActivityDetails(null);
      }
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Check if activity should show detailed info for free users
  const shouldShowDetailedInfo = (day: number, time: string): boolean => {
    if (isPremium) return true;
    
    // Day 1: Always show detailed info
    if (day === 1) return true;
    
    // Day 2: Show detailed info only for morning (before 12:00)
    if (day === 2) {
      const hour = parseInt(time.split(':')[0]);
      return hour < 12;
    }
    
    // Day 3+: No detailed info for free users
    return false;
  };

  // Check if activity should be completely hidden for free users
  const shouldHideActivity = (day: number, time: string): boolean => {
    if (isPremium) return false;
    
    // Day 2 afternoon and beyond: Hide for free users
    if (day === 2) {
      const hour = parseInt(time.split(':')[0]);
      return hour >= 12;
    }
    
    // Day 3+: Hide for free users
    return day >= 3;
  };

  const handleTranslate = async () => {
    if (!textToTranslate.trim()) return;
    
    setIsTranslating(true);
    try {
      const result = await apiCall('/openai-chat', {
        method: 'POST',
        body: JSON.stringify({ 
          message: `Translate this text to ${targetLanguage}: ${textToTranslate}`,
          language: targetLanguage,
          context: 'translation'
        })
      });


      console.log('[TripDetail] Translation API response:', result);
      
      if (result.success && result.response && typeof result.response === 'string' && result.response.trim()) {
        setTranslatedText(result.response);
      } else {
        console.warn('[TripDetail] Invalid translation response:', result);
        throw new Error(result.message || '翻訳に失敗しました');
      }
    } catch (error) {
      const apiError = error as APIError;
      
      globalErrorHandler.handleError(apiError, {
        page: 'TripDetail',
        action: 'translate',
        userAgent: navigator.userAgent,
        url: window.location.href
      });
      
      console.error('Translation error:', apiError);
      
      if (apiError.code === 'NETWORK_OFFLINE') {
        setTranslatedText('インターネット接続がありません。接続を確認してください。');
      } else if (apiError.status === 429) {
        setTranslatedText('翻訳サービスが混雑しています。しばらく待ってからお試しください。');
      } else {
        setTranslatedText('翻訳エラーが発生しました。もう一度お試しください。');
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'culture': return '⛩️';
      case 'food': return '🍜';
      case 'shopping': return '🛍️';
      case 'transport': return '✈️';
      case 'sightseeing': return '🏙️';
      default: return '📍';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>ダッシュボードに戻る</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                <Edit className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate(`/share/${tripId}`)}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Share className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Mock Data Notice */}
        {showMockNotice && (
          <MockDataNotice 
            onRetry={() => setShowMockNotice(false)}
            className="mb-6"
          />
        )}
        
        {/* Trip Header */}
        <motion.div
          className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="h-64 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${trip.image})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{trip.title}</h1>
              <div className="flex items-center space-x-4 text-lg">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-5 h-5" />
                  <span>{trip.destination}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {new Date(trip.startDate).toLocaleDateString('ja-JP')} - 
                    {new Date(trip.endDate).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Itinerary */}
        <div className="space-y-6">
          {trip.itinerary.map((day, dayIndex) => (
            <motion.div
              key={day.day}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: dayIndex * 0.1 }}
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                <h2 className="text-2xl font-bold">Day {day.day}</h2>
                <p className="text-blue-100">{day.title}</p>
                <p className="text-sm text-blue-200">
                  {new Date(day.date).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </p>
              </div>

              <div className="p-6">
                {day.activities.map((activity, actIndex) => {
                  // Check if activity should be hidden for free users
                  const shouldHide = shouldHideActivity(day.day, activity.time);
                  const showDetailed = shouldShowDetailedInfo(day.day, activity.time);
                  
                  if (shouldHide) {
                    return null;
                  }
                  
                  return (
                  <motion.div
                    key={actIndex}
                    className={`flex items-start space-x-4 py-4 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors ${
                      actIndex !== day.activities.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (dayIndex * 0.1) + (actIndex * 0.05) }}
                    onClick={() => fetchActivityDetails(activity)}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center text-xl">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">{activity.time}</span>
                        {showDetailed && activity.duration && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600">{activity.duration}分</span>
                          </>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">{activity.name}</h3>
                      
                      {/* Show description for detailed view */}
                      {showDetailed && activity.description && (
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{activity.location}</span>
                        </div>
                        {activity.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{activity.rating}</span>
                          </div>
                        )}
                        {showDetailed && activity.estimatedCost && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600">{activity.estimatedCost}</span>
                          </>
                        )}
                        {/* Navigation Button */}
                        {showDetailed && activity.coordinates && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${activity.coordinates.lat},${activity.coordinates.lng}&travelmode=transit`;
                              window.open(googleMapsUrl, '_blank');
                            }}
                            className="flex items-center space-x-1 px-2 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-xs"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>向かう</span>
                          </button>
                        )}
                      </div>
                      
                      {/* Transport Details */}
                      {showDetailed && activity.transportDetails && (
                        <div className="mt-2 p-2 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-3 text-xs text-green-700">
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
                      {showDetailed && activity.reviews && activity.reviews.length > 0 && (
                        <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <Star className="w-3 h-3 text-yellow-500 mt-0.5" />
                            <div>
                              <p className="text-xs text-yellow-800">"{activity.reviews[0].text}"</p>
                              <p className="text-xs text-yellow-600 mt-1">- {activity.reviews[0].author}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Show tips for detailed view */}
                      {showDetailed && activity.tips && (
                        <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-700">💡 {activity.tips}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2">
                      {showDetailed ? (
                        <button className="p-2 text-blue-600 hover:text-blue-700 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      ) : (
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Lock className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                  );
                })}
                
                {/* プレミアム制限メッセージ（2日目の午後以降のアクティビティがある場合） */}
                {!isPremium && day.day === 2 && day.activities.some((activity: any) => {
                  const hour = parseInt(activity.time.split(':')[0]);
                  return hour >= 12;
                }) && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-2 border-dashed border-purple-300">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-purple-800 mb-2">
                        午後のプラン詳細はプレミアム限定
                      </h3>
                      <p className="text-sm text-purple-600 mb-4">
                        2日目の午後以降（12:00以降）の詳細情報を見るには、プレミアムプランにアップグレードしてください。
                      </p>
                      <div className="mb-4 text-xs text-purple-500">
                        ✨ 午前中（12:00まで）の詳細は無料でご利用いただけます
                      </div>
                      <button
                        onClick={() => navigate('/checkout')}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        プレミアムにアップグレード
                      </button>
                    </div>
                  </div>
                )}
                
                {/* 3日目以降の制限表示 */}
                {!isPremium && day.day >= 3 && day.activities.length > 0 && (
                  <div className="p-6 bg-gradient-to-r from-gray-100 to-purple-100 rounded-xl border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Lock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-800">
                        {day.day}日目のプランはプレミアム限定です
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        アップグレードして完全な旅程をご覧ください
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {/* 残りの日程がある場合の制限表示 */}
          {!isPremium && trip.itinerary.length > 2 && trip.itinerary.slice(2).some((day: any) => day.activities.length > 0) && (
            <motion.div
              className="bg-white rounded-3xl shadow-lg p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                残り{trip.itinerary.length - 2}日間のプランがあります
              </h2>
              <p className="text-gray-600 mb-6">
                プレミアムプランにアップグレードして、完全な{trip.itinerary.length}日間の旅程をご覧ください。
              </p>
              <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-700">
                  ✨ 現在、1日目と2日目の午前中（12:00まで）の詳細をご覧いただけます
                </p>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                プレミアムにアップグレード
              </button>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
          className="mt-8 flex justify-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <button 
            onClick={() => navigate(`/trip/${tripId}/edit`)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            プランを編集
          </button>
          <button 
            onClick={() => setShowTranslator(true)}
            className="px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-all"
          >
            <Languages className="w-4 h-4 mr-2 inline-block" />
            翻訳する
          </button>
          <button 
            className="px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-all"
          >
            PDFダウンロード
          </button>
        </motion.div>
      </div>
      
      {/* Activity Details Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedActivity(null);
              setActivityDetails(null);
            }}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {isLoadingDetails ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">詳細を読み込み中...</p>
                </div>
              ) : activityDetails ? (
                <>
                  {/* Header */}
                  <div className="mb-6">
                    {activityDetails.data?.[0]?.photo?.images?.original?.url && (
                      <div 
                        className="h-48 bg-cover bg-center rounded-xl mb-4"
                        style={{ backgroundImage: `url(${activityDetails.data[0].photo.images.original.url})` }}
                      />
                    )}
                    <h2 className="text-2xl font-bold text-gray-800">{selectedActivity.name}</h2>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="ml-1 text-gray-700">{activityDetails.data?.[0]?.rating || selectedActivity.rating || '4.5'}</span>
                      </div>
                      <span className="text-gray-500">•</span>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="ml-1 text-gray-700">{selectedActivity.location}</span>
                      </div>
                      <span className="text-gray-500">•</span>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="ml-1 text-gray-700">{selectedActivity.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">説明</h3>
                    <p className="text-gray-700">
                      {activityDetails.data?.[0]?.description || selectedActivity.description || '詳細情報がありません。'}
                    </p>
                    
                    {/* Show additional details if available */}
                    {selectedActivity.estimatedCost && (
                      <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">予算目安:</span>
                          <br />
                          <span className="text-gray-600">{selectedActivity.estimatedCost}</span>
                        </div>
                        {selectedActivity.duration && (
                          <div>
                            <span className="font-medium text-gray-700">所要時間:</span>
                            <br />
                            <span className="text-gray-600">{selectedActivity.duration}分</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Show tips if available */}
                    {selectedActivity.tips && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-1">💡 おすすめポイント</h4>
                        <p className="text-sm text-blue-700">{selectedActivity.tips}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Access Information */}
                  {activityDetails.directions?.routes?.[0]?.legs?.[0]?.steps && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">アクセス方法</h3>
                      <div className="bg-gray-50 rounded-xl p-4">
                        {activityDetails.directions.routes[0].legs[0].steps.map((step: any, index: number) => (
                          <div key={index} className="mb-2 last:mb-0">
                            <div dangerouslySetInnerHTML={{ __html: step.html_instructions }} className="text-gray-700" />
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              <span>{step.distance?.text}</span>
                              <span>{step.duration?.text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Reviews */}
                  {activityDetails.reviews?.data && activityDetails.reviews.data.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">レビュー</h3>
                      <div className="space-y-4">
                        {activityDetails.reviews.data.slice(0, 3).map((review: any, index: number) => (
                          <div key={index} className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Users className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="font-medium text-gray-800">{review.user?.username || 'Anonymous'}</span>
                              </div>
                              <div className="flex">
                                {Array.from({ length: review.rating || 5 }).map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" />
                                ))}
                              </div>
                            </div>
                            <h4 className="font-medium text-gray-800">{review.title || 'Review'}</h4>
                            <p className="text-gray-600 text-sm">{review.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* External Links */}
                  {activityDetails.data?.[0]?.web_url && (
                    <div className="flex justify-end">
                      <a
                        href={activityDetails.data[0].web_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>TripAdvisorで詳細を見る</span>
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-600">詳細情報を取得できませんでした。</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Translation Modal */}
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
                <h2 className="text-2xl font-bold text-gray-800">翻訳ツール</h2>
                <button
                  onClick={() => setShowTranslator(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    翻訳先言語:
                  </label>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="zh">中文</option>
                      <option value="ko">한국어</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                </div>
                
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    翻訳するテキスト:
                  </label>
                  <textarea
                    value={textToTranslate}
                    onChange={(e) => setTextToTranslate(e.target.value)}
                    placeholder="翻訳したいテキストを入力してください..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={5}
                  />
                </div>
                
                <button
                  onClick={handleTranslate}
                  disabled={!textToTranslate.trim() || isTranslating}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                >
                  {isTranslating ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>翻訳中...</span>
                    </>
                  ) : (
                    <>
                      <Languages className="w-5 h-5" />
                      <span>翻訳する</span>
                    </>
                  )}
                </button>
                
                {/* Output */}
                {translatedText && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      翻訳結果:
                    </label>
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

export default TripDetail;