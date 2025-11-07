// authContext.ts
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  role: 'student' | 'staff' | 'management';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, permission: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('creator_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (username: string, permission: string) => {
    let role: 'student' | 'staff' | 'management' = 'student';
    if (permission === 'Superadmin') role = 'management';
    else if (permission === 'Lecturer') role = 'staff';
    
    const newUser: User = {
      id: username,
      email: `${username}@hsb.edu.vn`,
      name: username,
      username,
      role
    };
    
    setUser(newUser);
    localStorage.setItem('creator_user', JSON.stringify(newUser));
  };

  const logout = () => {
    localStorage.removeItem('creator_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};