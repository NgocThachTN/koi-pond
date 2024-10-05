import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi } from './user.api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  userRole: string | null;
  userEmail: string | null;
  userName: string | null; // Add this line
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null); // Add this line

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName'); // Add this line
    console.log('Auth state on mount:', { token, role, email, name }); // Update this line
    setIsAuthenticated(!!token);
    setUserRole(role);
    setUserEmail(email);
    setUserName(name); // Add this line
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi(email, password);
      const { token, role, email: userEmail, userName } = response.data; // Update this line
      console.log('Login successful:', { token, role, userEmail, userName }); // Update this line
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', role);  // Đảm bảo 'role' này khớp với giá trị từ API
      localStorage.setItem('userEmail', userEmail);
      localStorage.setItem('userName', userName); // Add this line
      setIsAuthenticated(true);
      setUserRole(role);
      setUserEmail(userEmail);
      setUserName(userName); // Add this line
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName'); // Add this line
    setIsAuthenticated(false);
    setUserRole(null);
    setUserEmail(null);
    setUserName(null); // Add this line
  };

  console.log('Current auth state:', { isAuthenticated, userRole, userEmail, userName }); // Update this line

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userRole, userEmail, userName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};