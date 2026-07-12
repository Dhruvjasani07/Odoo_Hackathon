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
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Real API call
      // const response = await api.post('/auth/login', { email, password });
      // const { token, role, name } = response.data;
      
      // Mock implementation for hackathon if API isn't ready
      console.log('Mocking login for', email);
      
      let role = 'Fleet Manager';
      if (email.includes('driver')) role = 'Driver';
      if (email.includes('safety')) role = 'Safety Officer';
      if (email.includes('finance')) role = 'Financial Analyst';

      const mockData = {
        token: 'mock-jwt-token-12345',
        role: role,
        name: email.split('@')[0],
      };

      setToken(mockData.token);
      setUser({ name: mockData.name, role: mockData.role });
      
      localStorage.setItem('transitops_token', mockData.token);
      localStorage.setItem('transitops_user', JSON.stringify({ name: mockData.name, role: mockData.role }));

      return { success: true };
    } catch (error) {
      console.error('Login failed', error);
      return { success: false, error: 'Invalid credentials' };
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
