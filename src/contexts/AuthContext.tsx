
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jean Dubois',
    email: 'jean.dubois@company.com',
    role: 'employee',
    department: 'Développement',
    leaveBalance: { annual: 25, sick: 10, personal: 5 }
  },
  {
    id: '2',
    name: 'Marie Martin',
    email: 'marie.martin@company.com',
    role: 'manager',
    department: 'Ressources Humaines',
    leaveBalance: { annual: 30, sick: 15, personal: 7 }
  },
  {
    id: '3',
    name: 'Pierre Dupont',
    email: 'pierre.dupont@company.com',
    role: 'employee',
    department: 'Marketing',
    leaveBalance: { annual: 22, sick: 8, personal: 3 }
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('gestion-conge-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('gestion-conge-user', JSON.stringify(foundUser));
    } else {
      throw new Error('Identifiants invalides');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gestion-conge-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
