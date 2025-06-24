import React, { createContext, useContext, useEffect, useState } from 'react';
import { get, post } from '../lib/api';

interface User {
  id: string;
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

  // initial fetch /me
  useEffect(() => {
    (async () => {
      try {
        const me = await get<User>('/auth/me');
        setUser(me);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string) => {
    await post<User>('/auth/login', { email });
    // fetch user data afterwards
    const me = await get<User>('/auth/me');
    setUser(me);
  };

  const logout = async () => {
    await post('/auth/logout');
    setUser(null);
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
  if (loading) return null; // could show spinner
  if (!user) {
    window.location.href = '/login';
    return null;
  }
  return <>{children}</>;
}; 