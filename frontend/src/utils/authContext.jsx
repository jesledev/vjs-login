import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const token = localStorage.getItem('token');

const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/protected', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data);
  } catch (error) {
    console.error(error.response?.data || 'Erreur inconnue');
  }
};

fetchData();

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}