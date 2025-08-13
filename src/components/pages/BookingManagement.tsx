import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Star, Edit, Trash2, Download, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'activity' | 'transport';
  title: string;
  date: string;
  time?: string;
  location: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: number;
  currency: string;
  confirmationNumber: string;
  details: any;
}

const BookingManagement: React.FC = () => {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      // Mock booking data
      const mockBookings: Booking[] = [
        {
          id: 'booking_1',
          type: 'flight',
          title: '東京 → 大阪',
          date: '2024-04-01',
          time: '09:30',
          location: '羽田空港',
          status: 'confirmed',
          price: 15000,
          currency: 'JPY',
          confirmationNumber: 'JL123456',
          details: {
            airline: 'JAL',
            flightNumber: 'JL123',
            seat: '12A'
          }
        },
        {
          id: 'booking_2',
          type: 'hotel',
          title: 'グランドホテル東京',
          date: '2024-04-01',
          location: '東京',
          status: 'confirmed',
          price: 25000,
          currency: 'JPY',
          confirmationNumber: 'HTL789012',
          details: {
            checkIn: '2024-04-01',
            checkOut: '2024-04-03',
            roomType: 'デラックスルーム',
            guests: 2
          }
        },
        {
          id: 'booking_3',
          type: 'activity',
          title: '浅草寺ガイドツアー',
          date: '2024-04-02',
          time: '14:00',
          location: '浅草',
          status: 'pending',
          price: 3500,
          currency: 'JPY',
          confirmationNumber: 'ACT345678',
          details: {
            duration: '2時間',
            language: '英語',
            groupSize: '最大15名'
          }
        }
      ];
      
      setBookings(mockBookings);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight': return '✈️';
      case 'hotel': return '🏨';
      case 'activity': return '🎯';
      case 'transport': return '🚌';
      default: return '📅';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return '確定';
      case 'pending': return '保留中';
      case 'cancelled': return 'キャンセル';
      default: return '不明';
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.type === filter);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">予約情報を読み込み中...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">予約管理</h1>
          <p className="text-lg text-gray-600">あなたの旅行予約を一元管理</p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {[
            { key: 'all', label: 'すべて', icon: '📋' },
            { key: 'flight', label: '航空券', icon: '✈️' },
            { key: 'hotel', label: 'ホテル', icon: '🏨' },
            { key: 'activity', label: 'アクティビティ', icon: '🎯' },
            { key: 'transport', label: '交通', icon: '🚌' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                filter === tab.key
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              className="bg-white rounded-3xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center text-2xl">
                    {getTypeIcon(booking.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{booking.title}</h3>
                    <div className="flex items-center space-x-4 text-gray-600 mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(booking.date).toLocaleDateString('ja-JP')}</span>
                      </div>
                      {booking.time && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{booking.time}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{booking.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      ¥{booking.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      確認番号: {booking.confirmationNumber}
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  {Object.entries(booking.details).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium text-gray-700 capitalize">{key}:</span>
                      <br />
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                  <Edit className="w-4 h-4" />
                  <span>変更</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>確認書</span>
                </button>
                {booking.status !== 'cancelled' && (
                  <button className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                    <Trash2 className="w-4 h-4" />
                    <span>キャンセル</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">予約がありません</h3>
            <p className="text-gray-600">新しい旅行を計画して予約を追加しましょう</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;