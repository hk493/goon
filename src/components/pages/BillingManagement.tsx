import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, Calendar, DollarSign, AlertCircle, CheckCircle, Edit } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  downloadUrl?: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

const BillingManagement: React.FC = () => {
  const { t } = useLanguage();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      // Mock billing data
      const mockInvoices: Invoice[] = [
        {
          id: 'inv_001',
          date: '2024-04-01',
          amount: 2500,
          currency: 'JPY',
          status: 'paid',
          description: 'プレミアムプラン - 4月',
          downloadUrl: '#'
        },
        {
          id: 'inv_002',
          date: '2024-03-01',
          amount: 2500,
          currency: 'JPY',
          status: 'paid',
          description: 'プレミアムプラン - 3月',
          downloadUrl: '#'
        },
        {
          id: 'inv_003',
          date: '2024-02-01',
          amount: 2500,
          currency: 'JPY',
          status: 'failed',
          description: 'プレミアムプラン - 2月',
          downloadUrl: '#'
        }
      ];

      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: 'pm_001',
          type: 'card',
          last4: '4242',
          brand: 'Visa',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true
        },
        {
          id: 'pm_002',
          type: 'card',
          last4: '0005',
          brand: 'Mastercard',
          expiryMonth: 8,
          expiryYear: 2026,
          isDefault: false
        }
      ];

      const mockCurrentPlan = {
        name: 'プレミアムプラン',
        price: 2500,
        currency: 'JPY',
        interval: 'month',
        nextBillingDate: '2024-05-01',
        status: 'active'
      };

      setInvoices(mockInvoices);
      setPaymentMethods(mockPaymentMethods);
      setCurrentPlan(mockCurrentPlan);
    } catch (error) {
      console.error('Failed to load billing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return '支払済み';
      case 'pending': return '保留中';
      case 'failed': return '失敗';
      default: return '不明';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getCardIcon = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'amex': return '💳';
      default: return '💳';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">請求情報を読み込み中...</p>
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">支払い・請求管理</h1>
          <p className="text-lg text-gray-600">プランと支払い方法を管理</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Plan */}
          <motion.div
            className="bg-white rounded-3xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">現在のプラン</h2>
            
            {currentPlan && (
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                  <h3 className="text-lg font-bold text-gray-800">{currentPlan.name}</h3>
                  <div className="text-3xl font-bold text-purple-600 mt-2">
                    ¥{currentPlan.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">/{currentPlan.interval === 'month' ? '月' : '年'}</div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ステータス:</span>
                    <span className="font-medium text-green-600">アクティブ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">次回請求日:</span>
                    <span className="font-medium">
                      {new Date(currentPlan.nextBillingDate).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition-colors">
                    プラン変更
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl hover:bg-gray-200 transition-colors">
                    解約
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Payment Methods & Invoices */}
          <div className="lg:col-span-2 space-y-8">
            {/* Payment Methods */}
            <motion.div
              className="bg-white rounded-3xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">支払い方法</h2>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                  追加
                </button>
              </div>

              <div className="space-y-4">
                {paymentMethods.map((method, index) => (
                  <motion.div
                    key={method.id}
                    className={`p-4 border rounded-xl ${
                      method.isDefault ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getCardIcon(method.brand || '')}</div>
                        <div>
                          <div className="font-medium text-gray-800">
                            {method.brand} •••• {method.last4}
                          </div>
                          <div className="text-sm text-gray-600">
                            有効期限: {method.expiryMonth}/{method.expiryYear}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {method.isDefault && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            デフォルト
                          </span>
                        )}
                        <button className="p-1 text-gray-500 hover:text-purple-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Billing History */}
            <motion.div
              className="bg-white rounded-3xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6">請求履歴</h2>

              <div className="space-y-4">
                {invoices.map((invoice, index) => (
                  <motion.div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-purple-300 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{invoice.description}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(invoice.date).toLocaleDateString('ja-JP')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-bold text-gray-800">
                          ¥{invoice.amount.toLocaleString()}
                        </div>
                        <div className={`flex items-center space-x-1 text-sm px-2 py-1 rounded-full ${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          <span>{getStatusText(invoice.status)}</span>
                        </div>
                      </div>
                      {invoice.status === 'paid' && (
                        <button className="p-2 text-gray-500 hover:text-purple-600 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button className="text-purple-600 hover:text-purple-700 font-medium">
                  すべての履歴を表示
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingManagement;