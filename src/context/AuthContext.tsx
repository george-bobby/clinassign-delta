
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { mockSignIn, mockSignOut } from '@/lib/supabase';
import { User, UserRole } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // In a real app, we would check Supabase session here
        const storedUser = localStorage.getItem('clinassign_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await mockSignIn(email, password);
      
      if (error) throw error;
      
      if (data?.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role as UserRole,
          name: email.split('@')[0] // Simple name from email for demo
        };
        
        setUser(userData);
        localStorage.setItem('clinassign_user', JSON.stringify(userData));
        
        toast({
          title: 'Welcome back!',
          description: `Logged in as ${userData.name}`,
        });
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await mockSignOut();
      setUser(null);
      localStorage.removeItem('clinassign_user');
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout Failed',
        description: 'An error occurred during logout.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const isRole = (role: UserRole) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, isRole }}>
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
