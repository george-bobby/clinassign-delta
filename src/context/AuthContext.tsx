
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
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
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // First check Supabase session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session) {
          // If we have a session, get user profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionData.session.user.id)
            .single()
            .execute();
            
          if (profileError) {
            console.error('Profile fetch error:', profileError);
            // If no profile found, try to create one with basic info
            if (sessionData.session.user.email) {
              const { data: insertData, error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: sessionData.session.user.id,
                  email: sessionData.session.user.email,
                  name: sessionData.session.user.email.split('@')[0],
                  role: 'student' as UserRole
                })
                .execute();
                
              if (insertError) {
                console.error('Profile creation error:', insertError);
              } else {
                // Fetch the profile again after creation
                const { data: newProfile } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', sessionData.session.user.id)
                  .single()
                  .execute();
                  
                if (newProfile) {
                  setUser({
                    id: newProfile.id,
                    email: newProfile.email,
                    name: newProfile.name || newProfile.email.split('@')[0],
                    role: newProfile.role as UserRole
                  });
                }
              }
            }
          } else if (profileData) {
            // Set user from profile data
            setUser({
              id: profileData.id,
              email: profileData.email,
              name: profileData.name || profileData.email.split('@')[0],
              role: profileData.role as UserRole
            });
          }
        } else {
          // Fallback to local storage for demo purposes
          const storedUser = localStorage.getItem('clinassign_user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        
        if (event === 'SIGNED_IN' && session) {
          // Fetch user profile on sign in
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .execute();
            
          if (profileError) {
            console.error('Profile fetch error on auth change:', profileError);
          } else if (profile) {
            const userData: User = {
              id: profile.id,
              email: profile.email,
              name: profile.name || profile.email.split('@')[0],
              role: profile.role as UserRole
            };
            
            setUser(userData);
            localStorage.setItem('clinassign_user', JSON.stringify(userData));
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('clinassign_user');
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log("Auth state:", { user, loading, error });
  }, [user, loading, error]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Try Supabase authentication first
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) {
        // For demo/development, fallback to mock sign in if Supabase fails
        console.warn('Supabase auth failed, using mock auth:', signInError);
        
        // Simulate authentication for demo
        const role = getSimulatedRoleForEmail(email);
        const mockUser: User = {
          id: '123',
          email,
          role: role as UserRole,
          name: email.split('@')[0]
        };
        
        setUser(mockUser);
        localStorage.setItem('clinassign_user', JSON.stringify(mockUser));
        
        toast({
          title: 'Welcome back! (Demo Mode)',
          description: `Logged in as ${mockUser.name}`,
        });
        
        navigate('/dashboard');
        return;
      }
      
      if (data?.user) {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
          .execute();
          
        if (profileError) {
          console.error('Profile fetch error:', profileError);
          
          // If profile doesn't exist, create one
          if (data.user.email) {
            const { data: insertData, error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email: data.user.email,
                name: data.user.email.split('@')[0],
                role: getSimulatedRoleForEmail(data.user.email) as UserRole
              })
              .execute();
              
            if (insertError) {
              console.error('Profile creation error:', insertError);
              throw insertError;
            }
            
            // Fetch the profile again after creation
            const { data: newProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single()
              .execute();
              
            if (newProfile) {
              const userData: User = {
                id: newProfile.id,
                email: newProfile.email,
                name: newProfile.name || newProfile.email.split('@')[0],
                role: newProfile.role as UserRole
              };
              
              setUser(userData);
              localStorage.setItem('clinassign_user', JSON.stringify(userData));
              
              toast({
                title: 'Welcome back!',
                description: `Logged in as ${userData.name}`,
              });
              
              navigate('/dashboard');
            }
          }
        } else if (profileData) {
          const userData: User = {
            id: profileData.id,
            email: profileData.email,
            name: profileData.name || profileData.email.split('@')[0],
            role: profileData.role as UserRole
          };
          
          setUser(userData);
          localStorage.setItem('clinassign_user', JSON.stringify(userData));
          
          toast({
            title: 'Welcome back!',
            description: `Logged in as ${userData.name}`,
          });
          
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password.',
        variant: 'destructive',
      });
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase signout error:', error);
        throw error;
      }
      
      // Clear local state
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
      setError(error as Error);
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

// Helper to simulate different roles based on email (for development)
function getSimulatedRoleForEmail(email: string): string {
  if (email.includes('student')) return 'student';
  if (email.includes('tutor')) return 'tutor';
  if (email.includes('nursing')) return 'nursing_head';
  if (email.includes('hospital')) return 'hospital_admin';
  if (email.includes('principal')) return 'principal';
  return 'student'; // Default role
}
