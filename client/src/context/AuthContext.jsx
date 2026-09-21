import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('projecthub_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const me = await api.getMe();
          setUser(me);
        } catch (err) {
          console.warn('Auth hydration failed, clearing token:', err.message);
          localStorage.removeItem('projecthub_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (identifier, password) => {
    const res = await api.login({ identifier, password });
    localStorage.setItem('projecthub_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (formData) => {
    const res = await api.register(formData);
    localStorage.setItem('projecthub_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('projecthub_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const me = await api.getMe();
        setUser(me);
      } catch (err) {
        console.error('Refresh user error:', err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
