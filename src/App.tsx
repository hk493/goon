import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, Auth0ProviderWithHistory } from './contexts/AuthContext';
import { TripProvider } from './contexts/TripContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import QuestionnaireFlow from './pages/QuestionnaireFlow';
import PlanGeneration from './pages/PlanGeneration';
import CheckoutPage from './pages/CheckoutPage';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import TripDetail from './pages/TripDetail';
import TripEdit from './pages/TripEdit';
import ESIMManagement from './pages/ESIMManagement';
import ChatBot from './pages/ChatBot';
import HelpFAQ from './pages/HelpFAQ';
import TranslationTool from './pages/TranslationTool';
import MapNavigation from './pages/MapNavigation';
import TripShare from './pages/TripShare';
import TripTemplates from './pages/TripTemplates';
import ReviewsRatings from './pages/ReviewsRatings';
import ProfileSettings from './pages/ProfileSettings';
import PaymentSuccess from './pages/PaymentSuccess';
import NotificationSettings from './pages/NotificationSettings';
import LocaleSettings from './pages/LocaleSettings';
import BillingManagement from './pages/BillingManagement';
import BookingManagement from './pages/BookingManagement';
import LegalPages from './pages/LegalPages';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import ErrorPages from './pages/ErrorPages';
import OfflineSupport from './pages/OfflineSupport';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './contexts/AuthContext';
import SEOHead from './components/SEOHead';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import CookieBanner from './components/CookieBanner';

// Scroll to top component
const ScrollToTop: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return null;
};

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/login" />;
};

function App() {
  return (
    <div className="App">
      <LanguageProvider>
        <Router>
          <Auth0ProviderWithHistory>
            <AuthProvider>
              <TripProvider>
                <NotificationProvider>
                  <ScrollToTop />
                  <SEOHead />
                  <Header />
                  <div className="pt-16"> {/* Add padding-top to prevent content from being hidden under the header */}
                  <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auth/*" element={<AuthPage />} />
                  <Route path="/questionnaire/*" element={<QuestionnaireFlow />} />
                  <Route path="/plan-generation" element={<PlanGeneration />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/legal" element={<LegalPages />} />
                  <Route path="/legal/terms" element={<TermsOfService />} />
                  <Route path="/legal/privacy" element={<PrivacyPolicy />} />
                  <Route path="/legal/cookies" element={<CookiePolicy />} />
                  <Route path="/help" element={<HelpFAQ />} />
                  <Route path="/chat" element={<ChatBot />} />
                  <Route path="/translate" element={<TranslationTool />} />
                  <Route path="/map" element={<MapNavigation />} />
<Route path="/templates" element={<TripTemplates />} />
<Route path="/reviews" element={<ReviewsRatings />} />
<Route path="/offline" element={<OfflineSupport />} />

{/* Protected Routes */}
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />

<Route path="/trip/:tripId" element={
  <ProtectedRoute>
    <TripDetail />
  </ProtectedRoute>
} />

<Route path="/esim" element={
  <ProtectedRoute>
    <ESIMManagement />
  </ProtectedRoute>
} />
                  <Route path="/share/:shareId" element={<TripShare />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfileSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings/notifications" element={
                    <ProtectedRoute>
                      <NotificationSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings/locale" element={
                    <ProtectedRoute>
                      <LocaleSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/billing" element={
                    <ProtectedRoute>
                      <BillingManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/bookings" element={
                    <ProtectedRoute>
                      <BookingManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* Error Routes */}
                  <Route path="/404" element={<ErrorPages type="404" />} />
                  <Route path="/500" element={<ErrorPages type="500" />} />
                  <Route path="/503" element={<ErrorPages type="503" />} />
                  <Route path="*" element={<ErrorPages type="404" />} />
                  </Routes>
                  <PWAInstallPrompt />
                  <CookieBanner />
                  </div>
                </NotificationProvider>
              </TripProvider>
            </AuthProvider>
          </Auth0ProviderWithHistory>
        </Router>
      </LanguageProvider>
    </div>
  );
}

export default App;