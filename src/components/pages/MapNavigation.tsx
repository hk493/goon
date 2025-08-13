import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Search, Star, Clock, Phone, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { apiCall, API_CONFIG, buildApiUrl, APIError } from '../config/api';
import { handleAWSError, globalErrorHandler } from '../utils/errorHandler';
import MockDataNotice from '../components/MockDataNotice';

const MapNavigation: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMockNotice, setShowMockNotice] = useState(false);

  // Multilingual content
  const getLocalizedContent = () => {
    switch (currentLanguage) {
      case 'en':
        return {
          title: 'Map & Navigation',
          subtitle: 'Explore tourist spots around your location',
          searchPlaceholder: 'Search for places...',
          searchButton: 'Search',
          nearbySpots: 'Nearby Spots',
          loading: 'Loading...',
          startNavigation: 'Start Navigation',
          detailInfo: 'Detail Info',
          interactiveMap: 'Interactive Map',
          mapDescription: 'Google Maps API will be integrated',
          currentLocation: 'Current Location'
        };
      case 'zh':
        return {
          title: '地图导航',
          subtitle: '探索您周围的旅游景点',
          searchPlaceholder: '搜索地点...',
          searchButton: '搜索',
          nearbySpots: '附近景点',
          loading: '加载中...',
          startNavigation: '开始导航',
          detailInfo: '详细信息',
          interactiveMap: '交互式地图',
          mapDescription: '将集成Google Maps API',
          currentLocation: '当前位置'
        };
      case 'ko':
        return {
          title: '지도 내비게이션',
          subtitle: '현재 위치 주변의 관광 명소 탐색',
          searchPlaceholder: '장소 검색...',
          searchButton: '검색',
          nearbySpots: '주변 명소',
          loading: '로딩 중...',
          startNavigation: '내비게이션 시작',
          detailInfo: '상세 정보',
          interactiveMap: '인터랙티브 지도',
          mapDescription: 'Google Maps API가 통합됩니다',
          currentLocation: '현재 위치'
        };
      case 'es':
        return {
          title: 'Mapa y Navegación',
          subtitle: 'Explora lugares turísticos alrededor de tu ubicación',
          searchPlaceholder: 'Buscar lugares...',
          searchButton: 'Buscar',
          nearbySpots: 'Lugares Cercanos',
          loading: 'Cargando...',
          startNavigation: 'Iniciar Navegación',
          detailInfo: 'Información Detallada',
          interactiveMap: 'Mapa Interactivo',
          mapDescription: 'Se integrará la API de Google Maps',
          currentLocation: 'Ubicación Actual'
        };
      case 'fr':
        return {
          title: 'Carte et Navigation',
          subtitle: 'Explorez les sites touristiques autour de votre position',
          searchPlaceholder: 'Rechercher des lieux...',
          searchButton: 'Rechercher',
          nearbySpots: 'Lieux Proches',
          loading: 'Chargement...',
          startNavigation: 'Démarrer la Navigation',
          detailInfo: 'Informations Détaillées',
          interactiveMap: 'Carte Interactive',
          mapDescription: 'L\'API Google Maps sera intégrée',
          currentLocation: 'Position Actuelle'
        };
      case 'hi':
        return {
          title: 'मैप और नेवीगेशन',
          subtitle: 'अपने स्थान के आसपास पर्यटन स्थलों का अन्वेषण करें',
          searchPlaceholder: 'स्थान खोजें...',
          searchButton: 'खोजें',
          nearbySpots: 'आसपास के स्थान',
          loading: 'लोड हो रहा है...',
          startNavigation: 'नेवीगेशन शुरू करें',
          detailInfo: 'विस्तृत जानकारी',
          interactiveMap: 'इंटरैक्टिव मैप',
          mapDescription: 'Google Maps API एकीकृत किया जाएगा',
          currentLocation: 'वर्तमान स्थान'
        };
      case 'ru':
        return {
          title: 'Карта и Навигация',
          subtitle: 'Исследуйте туристические места вокруг вашего местоположения',
          searchPlaceholder: 'Поиск мест...',
          searchButton: 'Поиск',
          nearbySpots: 'Ближайшие Места',
          loading: 'Загрузка...',
          startNavigation: 'Начать Навигацию',
          detailInfo: 'Подробная Информация',
          interactiveMap: 'Интерактивная Карта',
          mapDescription: 'Будет интегрирован Google Maps API',
          currentLocation: 'Текущее Местоположение'
        };
      case 'ar':
        return {
          title: 'الخريطة والملاحة',
          subtitle: 'استكشف المعالم السياحية حول موقعك',
          searchPlaceholder: 'البحث عن الأماكن...',
          searchButton: 'بحث',
          nearbySpots: 'الأماكن القريبة',
          loading: 'جاري التحميل...',
          startNavigation: 'بدء الملاحة',
          detailInfo: 'معلومات مفصلة',
          interactiveMap: 'خريطة تفاعلية',
          mapDescription: 'سيتم دمج Google Maps API',
          currentLocation: 'الموقع الحالي'
        };
      case 'id':
        return {
          title: 'Peta dan Navigasi',
          subtitle: 'Jelajahi tempat wisata di sekitar lokasi Anda',
          searchPlaceholder: 'Cari tempat...',
          searchButton: 'Cari',
          nearbySpots: 'Tempat Terdekat',
          loading: 'Memuat...',
          startNavigation: 'Mulai Navigasi',
          detailInfo: 'Info Detail',
          interactiveMap: 'Peta Interaktif',
          mapDescription: 'Google Maps API akan diintegrasikan',
          currentLocation: 'Lokasi Saat Ini'
        };
      case 'pt':
        return {
          title: 'Mapa e Navegação',
          subtitle: 'Explore pontos turísticos ao redor da sua localização',
          searchPlaceholder: 'Buscar lugares...',
          searchButton: 'Buscar',
          nearbySpots: 'Locais Próximos',
          loading: 'Carregando...',
          startNavigation: 'Iniciar Navegação',
          detailInfo: 'Informações Detalhadas',
          interactiveMap: 'Mapa Interativo',
          mapDescription: 'A API do Google Maps será integrada',
          currentLocation: 'Localização Atual'
        };
      case 'th':
        return {
          title: 'แผนที่และการนำทาง',
          subtitle: 'สำรวจสถานที่ท่องเที่ยวรอบตำแหน่งของคุณ',
          searchPlaceholder: 'ค้นหาสถานที่...',
          searchButton: 'ค้นหา',
          nearbySpots: 'สถานที่ใกล้เคียง',
          loading: 'กำลังโหลด...',
          startNavigation: 'เริ่มการนำทาง',
          detailInfo: 'ข้อมูลรายละเอียด',
          interactiveMap: 'แผนที่แบบโต้ตอบ',
          mapDescription: 'จะรวม Google Maps API',
          currentLocation: 'ตำแหน่งปัจจุบัน'
        };
      case 'vi':
        return {
          title: 'Bản Đồ và Điều Hướng',
          subtitle: 'Khám phá các điểm du lịch xung quanh vị trí của bạn',
          searchPlaceholder: 'Tìm kiếm địa điểm...',
          searchButton: 'Tìm kiếm',
          nearbySpots: 'Địa Điểm Gần Đây',
          loading: 'Đang tải...',
          startNavigation: 'Bắt Đầu Điều Hướng',
          detailInfo: 'Thông Tin Chi Tiết',
          interactiveMap: 'Bản Đồ Tương Tác',
          mapDescription: 'Google Maps API sẽ được tích hợp',
          currentLocation: 'Vị Trí Hiện Tại'
        };
      case 'it':
        return {
          title: 'Mappa e Navigazione',
          subtitle: 'Esplora i luoghi turistici intorno alla tua posizione',
          searchPlaceholder: 'Cerca luoghi...',
          searchButton: 'Cerca',
          nearbySpots: 'Luoghi Vicini',
          loading: 'Caricamento...',
          startNavigation: 'Inizia Navigazione',
          detailInfo: 'Informazioni Dettagliate',
          interactiveMap: 'Mappa Interattiva',
          mapDescription: 'L\'API di Google Maps sarà integrata',
          currentLocation: 'Posizione Attuale'
        };
      default: // Japanese
        return {
          title: '地図・ナビゲーション',
          subtitle: '現在地周辺の観光スポットを探索',
          searchPlaceholder: '場所を検索...',
          searchButton: '検索',
          nearbySpots: '周辺スポット',
          loading: '読み込み中...',
          startNavigation: 'ナビゲーション開始',
          detailInfo: '詳細情報',
          interactiveMap: 'インタラクティブマップ',
          mapDescription: 'Google Maps APIが統合されます',
          currentLocation: '現在地'
        };
    }
  };

  const content = getLocalizedContent();

  useEffect(() => {
    getCurrentLocation();
    loadNearbyPlaces();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Default to Tokyo
          setCurrentLocation({ lat: 35.6762, lng: 139.6503 });
        }
      );
    } else {
      // Default to Tokyo
      setCurrentLocation({ lat: 35.6762, lng: 139.6503 });
    }
  };

  const loadNearbyPlaces = async () => {
    setIsLoading(true);
    try {
      // Try to fetch from Google Places API
      try {
        const result = await apiCall('/google-maps', {
          method: 'POST',
          body: JSON.stringify({
            location: currentLocation ? `${currentLocation.lat},${currentLocation.lng}` : '35.6762,139.6503',
            radius: '5000',
            type: 'tourist_attraction'
          })
        });
        
        if (result.success && result.data) {
          setNearbyPlaces(result.data);
          return;
        }
      } catch (apiError) {
        console.warn('Failed to fetch from Google Places API, using fallback data:', apiError);
      }
      
      // Mock nearby places data
      const mockPlaces = [
        {
          id: '1',
          name: '浅草寺',
          nameEn: 'Senso-ji Temple',
          category: 'temple',
          rating: 4.8,
          distance: '0.5km',
          address: '東京都台東区浅草2-3-1',
          phone: '03-3842-0181',
          hours: '6:00-17:00',
          description: '東京最古の寺院',
          image: 'https://images.pexels.com/photos/161251/senso-ji-temple-asakusa-tokyo-japan-161251.jpeg'
        },
        {
          id: '2',
          name: '東京スカイツリー',
          nameEn: 'Tokyo Skytree',
          category: 'landmark',
          rating: 4.7,
          distance: '1.2km',
          address: '東京都墨田区押上1-1-2',
          phone: '0570-55-0634',
          hours: '8:00-22:00',
          description: '世界一高い電波塔',
          image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg'
        },
        {
          id: '3',
          name: '築地場外市場',
          nameEn: 'Tsukiji Outer Market',
          category: 'market',
          rating: 4.6,
          distance: '2.1km',
          address: '東京都中央区築地4-16-2',
          phone: '03-3541-9444',
          hours: '5:00-14:00',
          description: '新鮮な海鮮とグルメの市場',
          image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg'
        }
      ];
      
      setNearbyPlaces(mockPlaces);
    } catch (error) {
      console.error('Failed to load nearby places:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchPlaces = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      // Try to search using Google Places API
      try {
        const result = await apiCall('/google-maps', {
          method: 'POST',
          body: JSON.stringify({
            query: searchQuery,
            location: currentLocation ? `${currentLocation.lat},${currentLocation.lng}` : '35.6762,139.6503'
          })
        });
        
        if (result.success && result.data) {
          setNearbyPlaces(result.data);
          return;
        }
      } catch (apiError) {
        console.warn('Search API failed, using fallback:', apiError);
      }
      
      // Mock search results
      const searchResults = nearbyPlaces.filter(place => 
        place.name.includes(searchQuery) || 
        place.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setNearbyPlaces(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'temple': return '⛩️';
      case 'landmark': return '🗼';
      case 'market': return '🏪';
      case 'restaurant': return '🍜';
      case 'shopping': return '🛍️';
      default: return '📍';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'temple': return 'text-red-600 bg-red-100';
      case 'landmark': return 'text-blue-600 bg-blue-100';
      case 'market': return 'text-green-600 bg-green-100';
      case 'restaurant': return 'text-orange-600 bg-orange-100';
      case 'shopping': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{content.title}</h1>
          <p className="text-lg text-gray-600">{content.subtitle}</p>
        </motion.div>
        
        {/* Mock Data Notice */}
        {showMockNotice && (
          <MockDataNotice 
            onRetry={() => setShowMockNotice(false)}
            className="max-w-6xl mx-auto mb-4"
          />
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Area */}
          <div className="lg:col-span-2">
            {/* Search Bar */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchPlaces()}
                    placeholder={content.searchPlaceholder}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={searchPlaces}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  {content.searchButton}
                </button>
              </div>
            </motion.div>

            {/* Map Placeholder */}
            <motion.div
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="h-96 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{content.interactiveMap}</h3>
                  <p className="text-gray-600">{content.mapDescription}</p>
                </div>
                
                {/* Current Location Indicator */}
                {currentLocation && (
                  <div className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <Navigation className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">{content.currentLocation}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Places List */}
          <div className="space-y-6">
            <motion.div
              className="bg-white rounded-3xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">{content.nearbySpots}</h2>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">{content.loading}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {nearbyPlaces.map((place, index) => (
                    <motion.div
                      key={place.id}
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${
                        selectedPlace?.id === place.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                      onClick={() => setSelectedPlace(place)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{getCategoryIcon(place.category)}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{place.name}</h3>
                          <p className="text-sm text-gray-600">{place.nameEn}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm">{place.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{place.distance}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Selected Place Details */}
            {selectedPlace && (
              <motion.div
                className="bg-white rounded-3xl shadow-lg p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4">
                  <div
                    className="h-32 bg-cover bg-center rounded-xl mb-4"
                    style={{ backgroundImage: `url(${selectedPlace.image})` }}
                  />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedPlace.name}</h3>
                  <p className="text-gray-600 mb-4">{selectedPlace.description}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{selectedPlace.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{selectedPlace.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{selectedPlace.hours}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors">
                    {content.startNavigation}
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors">
                    {content.detailInfo}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapNavigation;