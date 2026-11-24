import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem('civicToken')) { setLoading(false); return; }
    api.get('/auth/me').then(res => setUser(res.data.user)).catch(() => localStorage.removeItem('civicToken')).finally(() => setLoading(false));
  }, []);
  const login = async (data, endpoint = '/auth/login') => {
    const res = await api.post(endpoint, data);
    localStorage.setItem('civicToken', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };
  const logout = () => { localStorage.removeItem('civicToken'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
