import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Shield, Check, ArrowLeft, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { apiCall, API_CONFIG, APIError } from '../config/api';
import { handleAWSError, globalErrorHandler } from '../utils/errorHandler';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    {
      id: 'premium',
      name: 'プレミアムプラン',
      price: 2500,
      currency: 'JPY',
      features: [
        '完全な旅程プラン',
        'カスタマイズ機能',
        '24時間AIサポート',
        'eSIM割引',
        '優先サポート'
      ]
    }
  ];

  const handlePayment = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await apiCall('/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({
          planId: 'premium',
          userId: user?.id,
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/checkout`
        })
      });

      if (result.success && result.sessionUrl) {
        window.location.href = result.sessionUrl;
      } else {
        throw new Error(result.message || '決済セッションの作成に失敗しました');
      }
    } catch (error) {
      const apiError = error as APIError;
      
      globalErrorHandler.handleError(apiError, {
        page: 'CheckoutPage',
        action: 'createCheckoutSession',
        userAgent: navigator.userAgent,
        url: window.location.href
      });

      console.error('Checkout error:', apiError);
      
      const errorInfo = handleAWSError(apiError);
      setError(errorInfo.message || '決済処理でエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsProcessing(false);
    }
  };

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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">プレミアムプランにアップグレード</h1>
          <p className="text-lg text-gray-600">完全な機能をお楽しみください</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Plan Details */}
          <motion.div
            className="bg-white rounded-3xl shadow-lg p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{plans[0].name}</h2>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                ¥{plans[0].price.toLocaleString()}
              </div>
              <div className="text-gray-600">月額</div>
            </div>

            <div className="space-y-4">
              {plans[0].features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            className="bg-white rounded-3xl shadow-lg p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">お支払い情報</h3>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-800">安全な決済</h4>
                    <p className="text-sm text-blue-600">Stripeによる安全な決済処理</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>処理中...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>決済に進む</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>後で決済する</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;