// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Auth0Provider, useAuth0, AppState } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isPremium?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  login: (connection?: string) => Promise<void>;
  logout: () => void;
  register: () => Promise<void>;
  upgradeToPremiun: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth0 = useAuth0();
  const [user, setUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (connection?: string) => {
    try {
      console.log('[AuthContext] Login attempt with connection:', connection);
      console.log('[AuthContext] Auth0 config:', {
        domain: import.meta.env.VITE_AUTH0_DOMAIN,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
        isLoading: auth0.isLoading,
        isAuthenticated: auth0.isAuthenticated
      });
      
      const options: any = {
        appState: { returnTo: '/checkout' } as AppState
      };
      
      if (connection) {
        options.connection = connection;
        options.authorizationParams = {
          connection: connection
        };
      }
      
      console.log('[AuthContext] Calling loginWithRedirect with options:', options);
      await auth0.loginWithRedirect(options);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    auth0.logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const register = async () => {
    try {
      // Get current path to return to after registration
      const returnTo = '/checkout';
        
      await auth0.loginWithRedirect({
        authorizationParams: {
          screen_hint: 'signup',
        },
        appState: { returnTo }
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const upgradeToPremiun = async () => {
    if (user) {
      const updatedUser = { ...user, isPremium: true };
      setUser(updatedUser);
      setIsPremium(true);
      localStorage.setItem('trippin-user', JSON.stringify(updatedUser));
      return Promise.resolve();
    }
    return Promise.reject(new Error('User not authenticated'));
  };

  useEffect(() => {
    if (auth0.isLoading) return;

    if (auth0.isAuthenticated && auth0.user) {
      const savedUserData = localStorage.getItem('trippin-user');
      const savedUser = savedUserData ? JSON.parse(savedUserData) : null;

      const newUser: User = {
        id: auth0.user.sub || '1',
        email: auth0.user.email || '',
        name: auth0.user.name || auth0.user.nickname || auth0.user.email?.split('@')[0] || '',
        avatar: auth0.user.picture,
        isPremium: savedUser?.isPremium || false
      };

      setUser(newUser);
      setIsPremium(savedUser?.isPremium || false);
      setIsAuthenticated(true);
      localStorage.setItem('trippin-user', JSON.stringify(newUser));
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [auth0.isLoading, auth0.isAuthenticated, auth0.user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, upgradeToPremiun, isPremium }}>
      {children}
    </AuthContext.Provider>
  );
};

// Auth0ProviderWithHistory.tsx
export const Auth0ProviderWithHistory: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  if (!domain || !clientId) {
    throw new Error('Auth0 domain or client ID not provided');
  }

  const onRedirectCallback = (appState?: AppState) => {
    const returnTo = appState?.returnTo || '/checkout';
    console.log('[Auth0] Redirecting to:', returnTo);
    navigate(returnTo);
  };
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      audience={audience}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
