import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Globe,
  Home,
  Calendar,
  MapPin,
  MessageCircle,
  HelpCircle,
  Languages,
  Smartphone,
  Star,
  FileText,
  Shield,
  Cookie,
  Users,
  CreditCard,
  Bookmark,
  Share2,
  // BookTemplate is not in some lucide-react versions. Use LayoutTemplate instead.
  LayoutTemplate as TemplateIcon,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const publicPages = [
    { path: '/', key: 'home', icon: Home },
    { path: '/dashboard', key: 'dashboard', icon: Calendar },
    { path: '/questionnaire/language', key: 'questionnaire', icon: Calendar },
    { path: '/checkout', key: 'checkout', icon: CreditCard },
    { path: '/chat', key: 'chat', icon: MessageCircle },
    { path: '/translate', key: 'translate', icon: Languages },
    { path: '/map', key: 'map', icon: MapPin },
    { path: '/templates', key: 'templates', icon: TemplateIcon },
    { path: '/reviews', key: 'reviews', icon: Star },
    { path: '/help', key: 'help', icon: HelpCircle },
    { path: '/offline', key: 'offline', icon: Share2 },
  ];

  const protectedPages = [
    { path: '/esim', key: 'esim', icon: Smartphone },
    { path: '/profile', key: 'profile', icon: User },
    { path: '/settings/notifications', key: 'notifications', icon: Settings },
    { path: '/settings/locale', key: 'locale', icon: Globe },
    { path: '/billing', key: 'billing', icon: CreditCard },
    { path: '/bookings', key: 'bookings', icon: Bookmark },
  ];

  const legalPages = [
    { path: '/legal', key: 'legal', icon: FileText },
    { path: '/legal/terms', key: 'terms', icon: FileText },
    { path: '/legal/privacy', key: 'privacy', icon: Shield },
    { path: '/legal/cookies', key: 'cookies', icon: Cookie },
  ];

  const authPages = [
    { path: '/auth/login', key: 'login', icon: User },
    { path: '/auth/register', key: 'register', icon: User },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 border-b shadow-sm ${
          location.pathname === '/'
            ? 'bg-black/20 backdrop-blur-md border-white/20'
            : 'bg-white/95 backdrop-blur-md border-gray-200'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* ロゴ */}
            <motion.button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src="/trippin-logo.png" alt="TRIPPIN Logo" className="w-10 h-10 rounded-full shadow-lg" />
              <span
                className={`text-2xl font-bold ${
                  location.pathname === '/'
                    ? 'text-white'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
                }`}
              >
                TRIPPIN
              </span>
            </motion.button>

            {/* 右側のナビゲーション */}
            <div className="flex items-center space-x-4">
              {/* 言語選択（デスクトップのみ） */}
              <div className="hidden md:block">
                <LanguageSelector />
              </div>

              {/* ハンバーガーメニューボタン */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 transition-colors ${
                  location.pathname === '/'
                    ? 'text-white hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                aria-label="Open menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* サイドバーメニュー */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* オーバーレイ */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            {/* サイドバー */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* サイドバーヘッダー */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src="/trippin-logo.png" alt="TRIPPIN Logo" className="w-8 h-8 rounded-full" />
                    <span className="text-xl font-bold">TRIPPIN</span>
                  </div>
                  <button onClick={closeMenu} className="p-2 hover:bg-white/20 rounded-full transition-colors" aria-label="Close menu">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* ユーザー情報 */}
                {isAuthenticated && user && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-white/80">{user.email}</p>
                        {user.isPremium && (
                          <span className="inline-block px-2 py-1 bg-yellow-400 text-yellow-900 text-xs rounded-full mt-1">プレミアム</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* メニューコンテンツ */}
              <div className="p-6 space-y-6">
                {/* 言語選択（モバイル用） */}
                <div className="md:hidden">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">{t('menu.languageSettings') || '言語設定'}</h3>
                  <LanguageSelector />
                </div>

                {/* パブリックページ */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">{t('menu.mainPages')}</h3>
                  <div className="space-y-1">
                    {publicPages.map((page) => (
                      <Link
                        key={page.path}
                        to={page.path}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          location.pathname === page.path
                            ? 'text-purple-600 bg-purple-50'
                            : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                        }`}
                        onClick={closeMenu}
                      >
                        <page.icon className="w-5 h-5" />
                        <span className="text-sm">{t(`menu.${page.key}`)}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 認証ページ（未ログイン時） */}
                {!isAuthenticated && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">{t('menu.account')}</h3>
                    <div className="space-y-1">
                      {authPages.map((page) => (
                        <Link
                          key={page.path}
                          to={page.path}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            location.pathname === page.path
                              ? 'text-purple-600 bg-purple-50'
                              : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                          }`}
                          onClick={closeMenu}
                        >
                          <page.icon className="w-5 h-5" />
                          <span className="text-sm">{t(`menu.${page.key}`)}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 認証が必要なページ（ログイン時） */}
                {isAuthenticated && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">{t('menu.myPages')}</h3>
                    <div className="space-y-1">
                      {protectedPages.map((page) => (
                        <Link
                          key={page.path}
                          to={page.path}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            location.pathname === page.path
                              ? 'text-purple-600 bg-purple-50'
                              : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                          }`}
                          onClick={closeMenu}
                        >
                          <page.icon className="w-5 h-5" />
                          <span className="text-sm">{t(`menu.${page.key}`)}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 法的ページ */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">{t('menu.legalInfo')}</h3>
                  <div className="space-y-1">
                    {legalPages.map((page) => (
                      <Link
                        key={page.path}
                        to={page.path}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          location.pathname === page.path
                            ? 'text-purple-600 bg-purple-50'
                            : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                        }`}
                        onClick={closeMenu}
                      >
                        <page.icon className="w-5 h-5" />
                        <span className="text-sm">{t(`menu.${page.key}`)}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 言語・地域 へのショートリンク（任意） */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">{t('menu.languageRegion') || '言語・地域'}</h3>
                  <div className="space-y-1">
                    <Link
                      to="/questionnaire/language"
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        location.pathname === '/questionnaire/language'
                          ? 'text-purple-600 bg-purple-50'
                          : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                      }`}
                      onClick={closeMenu}
                    >
                      <Globe className="w-5 h-5" />
                      <span className="text-sm">{t('menu.questionnaire') || '言語選択'}</span>
                    </Link>
                  </div>
                </div>

                {/* ログアウト（ログイン時のみ） */}
                {isAuthenticated && (
                  <div className="pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="flex items-center space-x-3 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm">{t('menu.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
