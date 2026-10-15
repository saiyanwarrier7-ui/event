import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (data: {
    full_name: string;
    email: string;
    password: string;
    college_name: string;
    department: string;
    year_of_study: string;
    phone: string;
  }) => Promise<UserProfile>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('nexustech_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('nexustech_token');
      if (storedToken) {
        try {
          const res = await api.getCurrentUser();
          setUser(res.user);
        } catch (err) {
          console.error('Session expired or invalid:', err);
          localStorage.removeItem('nexustech_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    const res = await api.login(email, password);
    localStorage.setItem('nexustech_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (data: {
    full_name: string;
    email: string;
    password: string;
    college_name: string;
    department: string;
    year_of_study: string;
    phone: string;
  }): Promise<UserProfile> => {
    const res = await api.register(data);
    localStorage.setItem('nexustech_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('nexustech_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.getCurrentUser();
      setUser(res.user);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated,
        isAdmin,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
