import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Github, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const Login = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedAutoLogin, setHasAttemptedAutoLogin] = useState(false);

  useEffect(() => {
    // Only attempt auto-login once when component mounts
    if (!hasAttemptedAutoLogin) {
      setHasAttemptedAutoLogin(true);
      handleAutoLogin();
    }
  }, []);

  const handleAutoLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('[Login] Attempting auto-login to Auth0...');
      await login();
    } catch (error) {
      console.error('[Login] Auto-login failed:', error);
      setError('自動ログインに失敗しました。手動でログインしてください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('[Login] Manual login attempt...');
      await login();
    } catch (error) {
      console.error('[Login] Manual login failed:', error);
      setError('ログインに失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectAuth0Login = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('[Login] Direct Auth0 login attempt...');
      // Force Auth0 login with explicit parameters
      await login('Username-Password-Authentication');
    } catch (error) {
      console.error('[Login] Direct Auth0 login failed:', error);
      setError('Auth0ログインに失敗しました。ページを更新してお試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <LogIn className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h1
            className="text-3xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {t('auth.welcome')}
          </motion.h1>
          
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('auth.loginSubtitle')}
          </motion.p>
        </div>

        {/* Form */}
        <motion.form
          className="bg-white rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="text-center">
            {isLoading ? (
              <>
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-gray-600 mb-4">{t('auth.redirectingToAuth0')}</p>
                <p className="text-sm text-gray-500">Auth0にリダイレクト中...</p>
              </>
            ) : (
              <>
                <LogIn className="w-16 h-16 text-purple-600 mx-auto mb-6" />
                <h2 className="text-xl font-bold text-gray-800 mb-4">ログインが必要です</h2>
                <p className="text-gray-600 mb-4">TRIPPINのすべての機能をご利用いただくには、ログインしてください。</p>
              </>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}
            
            {/* Login Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="space-y-4">
                <motion.button
                  onClick={handleManualLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  <LogIn className="w-5 h-5" />
                  <span>Auth0でログイン</span>
                </motion.button>
                
                <motion.button
                  onClick={handleDirectAuth0Login}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  <Mail className="w-5 h-5" />
                  <span>メール/パスワードでログイン</span>
                </motion.button>
                
                <p className="text-xs text-gray-500 text-center">
                  自動リダイレクトされない場合は、上記のボタンをクリックしてください
                </p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="mt-6 text-center space-y-4">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              {t('auth.forgotPassword')}
            </Link>
            
            <div className="text-sm text-gray-600">
              {t('auth.noAccount')}{' '}
              <Link
                to="/auth/register"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {t('auth.register')}
              </Link>
            </div>
            
            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-600">
                <p>Debug Info:</p>
                <p>Auth0 Domain: {import.meta.env.VITE_AUTH0_DOMAIN}</p>
                <p>Auth0 Client ID: {import.meta.env.VITE_AUTH0_CLIENT_ID}</p>
                <p>Has attempted auto-login: {hasAttemptedAutoLogin.toString()}</p>
              </div>
            )}
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Login;
