/**
 * ## src/store/AuthContext.tsx
 */
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authApi } from '../services/api';
import { User } from '../types';
import { toast } from '../hooks/useToast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<any>;
  logout: () => void;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      const res = await authApi.getMe();
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      localStorage.removeItem('auth_token');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
    
    const handleUnauthorized = () => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('auth_token');
      toast.error('Sesi telah berakhir, silakan login kembali');
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [fetchUser]);

  const login = async (credentials: any) => {
    try {
      const res = await authApi.login(credentials);
      localStorage.setItem('auth_token', res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      toast.success('Selamat datang, ' + res.data.user.full_name);
      return res.data;
    } catch (err: any) {
      toast.error(err.message || 'Login gagal');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
    toast.info('Anda telah keluar');
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout, refetch: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
