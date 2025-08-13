import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Wifi, Download, Settings, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext'; 
import { apiCall, API_CONFIG, APIError } from '../config/api';
import { handleAWSError, globalErrorHandler } from '../utils/errorHandler';
import MockDataNotice from '../components/MockDataNotice';

interface ESIMPlan {
  id: string;
  name: string;
  dataAmount: string;
  validity: string;
  price: { amount: number; currency: string };
  status: 'active' | 'inactive' | 'expired';
  usage: { used: number; total: number };
  activationDate?: string;
  expiryDate?: string;
}

const ESIMManagement: React.FC = () => {
  const { t } = useLanguage();
  const [esimPlans, setESIMPlans] = useState<ESIMPlan[]>([]);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMockNotice, setShowMockNotice] = useState(false);

  useEffect(() => {
    loadESIMData();
  }, []);

  const loadESIMData = async () => {
    try {
      // Load user's eSIM plans
      const userPlans: ESIMPlan[] = [
        {
          id: 'esim_1',
          name: 'Japan 5GB - 30 Days',
          dataAmount: '5GB',
          validity: '30日',
          price: { amount: 5500, currency: 'JPY' },
          status: 'active',
          usage: { used: 2.3, total: 5 },
          activationDate: '2024-01-15',
          expiryDate: '2024-02-14'
        },
        {
          id: 'esim_2',
          name: 'Japan 1GB - 7 Days',
          dataAmount: '1GB',
          validity: '7日',
          price: { amount: 1500, currency: 'JPY' },
          status: 'expired',
          usage: { used: 1, total: 1 },
          activationDate: '2024-01-01',
          expiryDate: '2024-01-08'
        }
      ];
      setESIMPlans(userPlans);

      // Load available plans
      try {
        const result = await apiCall('/esim', {
          method: 'GET'
        });
        if (result.success && result.data) {
          // Check if this is mock data
          if (result.isMockData) {
            setShowMockNotice(true);
          }
          setAvailablePlans(result.data);
        } else {
          throw new Error(result.message || 'eSIMプラン情報の取得に失敗しました');
        }
      } catch (fetchError) {
        const apiError = fetchError as APIError;
        
        globalErrorHandler.handleError(apiError, {
          page: 'ESIMManagement',
          action: 'loadAvailablePlans',
          userAgent: navigator.userAgent,
          url: window.location.href
        });
        
        console.warn('Failed to load available plans from server, using fallback data:', apiError);
        
        // Use fallback data when server is not available
        const fallbackPlans = [
          {
            id: 'plan_1',
            name: 'Japan 3GB - 15 Days',
            description: '日本全国で使える15日間3GBプラン',
            dataAmount: '3GB',
            validity: '15日',
            price: { amount: 3500, currency: 'JPY' }
          },
          {
            id: 'plan_2',
            name: 'Japan 10GB - 30 Days',
            description: '日本全国で使える30日間10GBプラン',
            dataAmount: '10GB',
            validity: '30日',
            price: { amount: 8500, currency: 'JPY' }
          }
        ];
        setAvailablePlans(fallbackPlans);
      }
    } catch (error) {
      console.error('Failed to load eSIM data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseESIM = async (planId: string) => {
    try {
      const result = await apiCall('/esim', {
        method: 'POST',
        body: JSON.stringify({
          planId,
          customerInfo: {
            email: 'user@example.com',
            name: 'User Name'
          }
        })
      });

      if (result.success) {
        // Show QR code and activation instructions
        alert('eSIM購入が完了しました！QRコードをスキャンして設定してください。');
        loadESIMData(); // Refresh data
      } else {
        throw new Error(result.message || 'eSIM購入に失敗しました');
      }
    } catch (error) {
      const apiError = error as APIError;
      
      globalErrorHandler.handleError(apiError, {
        page: 'ESIMManagement',
        action: 'purchaseESIM',
        userAgent: navigator.userAgent,
        url: window.location.href
      });
      
      console.error('Failed to purchase eSIM:', apiError);
      
      const errorInfo = handleAWSError(apiError);
      if (apiError.status === 402) {
        alert('決済に失敗しました。支払い方法を確認してください。');
      } else if (apiError.status === 409) {
        alert('選択されたプランは在庫切れです。他のプランをお試しください。');
      } else {
        alert(errorInfo.message || 'eSIM購入に失敗しました。もう一度お試しください。');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-yellow-600 bg-yellow-100';
      case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <AlertCircle className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">eSIM情報を読み込み中...</p>
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('esim.title')}</h1>
          <p className="text-lg text-gray-600">{t('esim.subtitle')}</p>
        </motion.div>
        
        {/* Mock Data Notice */}
        {showMockNotice && (
          <MockDataNotice 
            onRetry={() => setShowMockNotice(false)}
            className="max-w-6xl mx-auto mb-4"
          />
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current eSIM Plans */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">{t('esim.currentPlans')}</h2> 
            
            {esimPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className="bg-white rounded-3xl shadow-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                      <p className="text-gray-600">{plan.dataAmount} • {plan.validity}</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(plan.status)}`}>
                    {getStatusIcon(plan.status)}
                    <span>{plan.status === 'active' ? t('esim.active') : plan.status === 'expired' ? t('esim.expired') : t('esim.inactive')}</span>
                  </div>
                </div>

                {plan.status === 'active' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>{t('esim.dataUsage')}</span>
                      <span>{plan.usage.used}GB / {plan.usage.total}GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${(plan.usage.used / plan.usage.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">{t('esim.activationDate')}:</span>
                    <br />
                    {plan.activationDate ? new Date(plan.activationDate).toLocaleDateString('ja-JP') : '-'}
                  </div>
                  <div>
                    <span className="font-medium">{t('esim.expiryDate')}:</span>
                    <br />
                    {plan.expiryDate ? new Date(plan.expiryDate).toLocaleDateString('ja-JP') : '-'}
                  </div>
                </div>

                <div className="mt-4 flex space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                    <Settings className="w-4 h-4" /> 
                    <span>{t('esim.settings')}</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>{t('esim.qrCode')}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Available Plans */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">{t('esim.availablePlans')}</h2>
            
            {availablePlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className="bg-white rounded-2xl shadow-lg p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>{t('esim.dataCapacity')}:</span>
                    <span className="font-medium">{plan.dataAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('esim.validityPeriod')}:</span>
                    <span className="font-medium">{plan.validity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('esim.coverageArea')}:</span>
                    <span className="font-medium">{t('esim.japanNationwide')}</span>
                  </div>
                </div>

                <div className="text-2xl font-bold text-purple-600 mb-4">
                  ¥{plan.price.amount.toLocaleString()}
                </div>

                <button
                  onClick={() => purchaseESIM(plan.id)}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('esim.purchase')}</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESIMManagement;