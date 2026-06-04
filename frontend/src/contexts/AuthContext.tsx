import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../api/client';
import type { AuthResponse } from '../types';

interface AuthContextValue {
  token: string | null;
  email: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = window.localStorage.getItem('psa_token');
    const savedEmail = window.localStorage.getItem('psa_email');
    if (savedToken) setToken(savedToken);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const persistAuth = (response: AuthResponse) => {
    setToken(response.token);
    setEmail(response.user.email);
    window.localStorage.setItem('psa_token', response.token);
    window.localStorage.setItem('psa_email', response.user.email);
  };

  const login = async (emailValue: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email: emailValue, password });
    persistAuth(data);
  };

  const register = async (emailValue: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/register', { email: emailValue, password });
    persistAuth(data);
  };

  const logout = () => {
    setToken(null);
    setEmail(null);
    window.localStorage.removeItem('psa_token');
    window.localStorage.removeItem('psa_email');
  };

  const value = useMemo(() => ({ token, email, login, register, logout }), [token, email]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
