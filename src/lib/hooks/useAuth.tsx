'use client';

import { useState, createContext, useContext, ReactNode, useCallback } from 'react';
import { useToast } from '@/components/ui/ToastProvider';

interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  balance: number;
  joinedDate: string;
  totalTrades: number;
  totalPnl: number;
  winRate: number;
  followers: number;
  following: number;
  isVerified: boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  connectWallet: () => Promise<boolean>;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultUser: User = {
  id: 'user-001',
  username: 'predictor_x',
  displayName: 'PredictX Trader',
  email: 'trader@predictx.io',
  avatar: 'from-emerald-400 to-cyan-500',
  balance: 10000,
  joinedDate: '2026-03-15',
  totalTrades: 156,
  totalPnl: 4250,
  winRate: 64.8,
  followers: 234,
  following: 89,
  isVerified: true,
  tier: 'gold',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { addToast } = useToast();

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800));
    const u = { ...defaultUser, email };
    setUser(u);
    addToast({ type: 'success', title: '登录成功', message: `欢迎回来, ${u.displayName}!` });
    return true;
  }, [addToast]);

  const register = useCallback(async (username: string, email: string, _password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 1000));
    const u = { ...defaultUser, username, email, displayName: username, balance: 5000, totalTrades: 0, totalPnl: 0, followers: 0, following: 0, tier: 'bronze' as const };
    setUser(u);
    addToast({ type: 'success', title: '注册成功! 🎉', message: '已赠送 $5,000 体验金' });
    return true;
  }, [addToast]);

  const logout = useCallback(() => {
    setUser(null);
    addToast({ type: 'info', title: '已退出登录' });
  }, [addToast]);

  const connectWallet = useCallback(async (): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 1200));
    setUser({ ...defaultUser });
    addToast({ type: 'success', title: '钱包已连接', message: 'MetaMask 连接成功' });
    return true;
  }, [addToast]);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout, connectWallet, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
