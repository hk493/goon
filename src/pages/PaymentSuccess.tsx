import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiCall, API_CONFIG } from '../config/api';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { upgradeToPremiun } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        
        if (!sessionId) {
          setError('セッションIDが見つかりません');
          setIsVerifying(false);
          return;
        }
        
        const data = await apiCall('/verify-payment', {
          method: 'POST',
          body: JSON.stringify({ sessionId })
        });
        
        if (data.success) {
          // Upgrade the user to premium
          await upgradeToPremiun();
          setIsVerifying(false);
        } else {
          throw new Error(data.message || '支払い検証に失敗しました');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setError(error instanceof Error ? error.message : '支払い検証に失敗しました');
        setIsVerifying(false);
      }
    };
    
    verifyPayment();
  }, [searchParams, upgradeToPremiun]);

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <motion.div
        className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isVerifying ? (
          <>
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">支払いを確認中...</h2>
            <p className="text-gray-600">しばらくお待ちください</p>
          </>
        ) : error ? (
          <>
            <div className="text-red-500 text-6xl mb-6">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">エラーが発生しました</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/checkout')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              もう一度試す
            </button>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">お支払いが完了しました！</h2>
            <p className="text-gray-600 mb-8">
              プレミアムプランへのアップグレードが完了しました。すべての機能をお楽しみください。
            </p>
            <motion.button
              onClick={handleContinue}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl mx-auto hover:from-purple-700 hover:to-pink-700 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>ダッシュボードに進む</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;