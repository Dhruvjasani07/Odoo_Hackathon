import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedToken = localStorage.getItem('transitops_token');
    const storedUser = localStorage.getItem('transitops_user');

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // If the old state doesn't have an email, automatically clear it to force a fresh login
      if (!parsedUser.email) {
        localStorage.removeItem('transitops_token');
        localStorage.removeItem('transitops_user');
      } else {
        setToken(storedToken);
        setUser(parsedUser);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      // Real API call
      const response = await api.post('/auth/login', { email, password, role });
      const { token, role: userRole, name, email: userEmail } = response.data;
      
      setToken(token);
      setUser({ name, role: userRole, email: userEmail });
      
      localStorage.setItem('transitops_token', token);
      localStorage.setItem('transitops_user', JSON.stringify({ name, role: userRole, email: userEmail }));

      return { success: true };
    } catch (error) {
      console.error('Login failed', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Invalid credentials' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('transitops_token');
    localStorage.removeItem('transitops_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
