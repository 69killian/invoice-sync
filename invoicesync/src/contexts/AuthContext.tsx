import React, { createContext, useContext, useEffect, useState } from 'react';
import { get, post } from '../lib/api';

interface User {
  id: string;
  email: string;
}

interface LoginRequest {
  email: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      console.log('Fetching user data...');
      const me = await get<User>('/auth/me');
      console.log('User data received:', me);
      
      if (!me || !me.id || !me.email) {
        console.warn('Invalid user data:', me);
        setUser(null);
        return null;
      }
      
      setUser(me);
      return me;
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // initial fetch /me
  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string) => {
    try {
      console.log('Attempting login...');
      const loginResponse = await post<User>('/auth/login', { email });
      console.log('Login successful:', loginResponse);
      
      if (!loginResponse || !loginResponse.id || !loginResponse.email) {
        console.error('Invalid login response:', loginResponse);
        throw new Error('Invalid login response');
      }

      // Mettre à jour l'état avec la réponse du login
      setUser(loginResponse);

      // Attendre que les cookies soient établis
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Faire plusieurs tentatives pour vérifier l'authentification
      for (let i = 0; i < 3; i++) {
        console.log(`Verifying authentication (attempt ${i + 1})...`);
        const userData = await fetchUser();
        
        if (userData && userData.id && userData.email) {
          console.log('Authentication verified successfully');
          return;
        }
        
        // Attendre avant la prochaine tentative
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      throw new Error('Failed to verify authentication after login');
    } catch (err) {
      console.error('Login failed:', err);
      setUser(null);
      throw err;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      await post('/auth/logout', {});
      setUser(null);
      console.log('Logout successful');
    } catch (err) {
      console.error('Logout failed:', err);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Chargement de l'authentification...</div>;
  }
  
  if (!user) {
    console.log('No authenticated user found, redirecting to login...');
    window.location.href = '/login';
    return null;
  }
  
  return <>{children}</>;
}; 