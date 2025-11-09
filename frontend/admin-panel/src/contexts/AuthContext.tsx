import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token and user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem('adminToken');
      
      if (savedToken) {
        setToken(savedToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        
        try {
          const response = await api.get('/auth/me');
          if (response.data.success) {
            const userData = response.data.data;
            // Only allow ADMIN and KITCHEN_STAFF roles
            if (userData.role === 'ADMIN' || userData.role === 'KITCHEN_STAFF') {
              setUser(userData);
            } else {
              // Not an admin, clear token
              localStorage.removeItem('adminToken');
              delete api.defaults.headers.common['Authorization'];
            }
          }
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('adminToken');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        
        // Only allow ADMIN and KITCHEN_STAFF to login to admin panel
        if (user.role !== 'ADMIN' && user.role !== 'KITCHEN_STAFF') {
          throw new Error('You do not have permission to access the admin panel');
        }
        
        setUser(user);
        setToken(token);
        localStorage.setItem('adminToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        throw new Error(response.data.error?.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error?.message || error.message || 'Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('adminToken');
    delete api.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

