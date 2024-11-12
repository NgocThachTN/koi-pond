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
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [accountStatus, setAccountStatus] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        const role = localStorage.getItem('userRole');
        const email = localStorage.getItem('userEmail');

        console.log('Auth initialization:', { token, role, email });

        if (token && role && email) {
          setIsAuthenticated(true);
          setUserRole(role);
          setUserEmail(email);
        } else {
          console.log('Missing auth data, clearing state');
          setIsAuthenticated(false);
          setUserRole(null);
          setUserEmail(null);
          localStorage.clear();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi(email, password);
      console.log('Login response:', response);

      if (response?.data?.token) {
        const { token, role, email: userEmail } = response.data;

        // Set localStorage items
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userEmail', userEmail);

        // Update state
        setIsAuthenticated(true);
        setUserRole(role);
        setUserEmail(userEmail);

        console.log('Login successful:', { token, role, userEmail });
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login error:', error);
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

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-violet-500" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        userRole,
        userEmail,
        accountStatus
      }}
    >
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