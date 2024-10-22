import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi } from './user.api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  userRole: string | null;
  userEmail: string | null;
  accountStatus: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [accountStatus, setAccountStatus] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');
    const status = localStorage.getItem('accountStatus');
    console.log('Auth state on mount:', { token, role, email, status });
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUserEmail(email);
      setAccountStatus(status);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi(email, password);
      if ('token' in response.data) {
        const { token, role, email: userEmail, status } = response.data;
        console.log('Login response:', response.data);
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('accountStatus', status);
        setIsAuthenticated(true);
        setUserRole(role);
        setUserEmail(userEmail);
        setAccountStatus(status);
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('accountStatus');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserEmail(null);
    setAccountStatus(null);
  };

  console.log('Current auth state:', { isAuthenticated, userRole, userEmail, accountStatus });

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userRole, userEmail, accountStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log('Current auth state in useAuth:', context); // Thêm log này
  return context;
};
