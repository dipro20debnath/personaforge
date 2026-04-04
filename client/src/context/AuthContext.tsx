'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthCtx {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuth: boolean;
}

const AuthContext = createContext<AuthCtx>({ token: null, login: () => {}, logout: () => {}, isAuth: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => { setToken(localStorage.getItem('pf_token')); }, []);
  const login = (t: string) => { localStorage.setItem('pf_token', t); setToken(t); };
  const logout = () => { localStorage.removeItem('pf_token'); setToken(null); window.location.href = '/login'; };
  return <AuthContext.Provider value={{ token, login, logout, isAuth: !!token }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
