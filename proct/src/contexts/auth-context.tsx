"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type UserRole = 'candidate' | 'recruiter';

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem('proctoring-system-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user && pathname === '/auth') {
        router.push(`/${user.role}/dashboard`);
      } else if (!user && pathname !== '/auth' && !pathname.startsWith('/_next/')) {
        if (pathname !== '/') {
          router.push('/auth');
        }
      }
    }
  }, [user, loading, pathname, router]);

  const login = (email: string, role: UserRole) => {
    const newUser: User = { 
      id: Date.now().toString(), 
      email, 
      role,
      name: email.split('@')[0]
    };
    setUser(newUser);
    localStorage.setItem('proctoring-system-user', JSON.stringify(newUser));
    router.push(`/${role}/dashboard`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('proctoring-system-user');
    router.push('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
