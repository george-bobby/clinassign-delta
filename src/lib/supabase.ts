import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

const supabaseUrl = 'https://acmihgikuqzekgewttyf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjbWloZ2lrdXF6ZWtnZXd0dHlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NTA2MjAsImV4cCI6MjA1NjMyNjYyMH0.OXknSZFFSjy7Q3SnjDeYIfgBJ25l8MTkxm39OJE2xoM';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email: string, password: string, metadata: any) => {
  return await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: metadata
    }
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

// Mock functions for development purposes
export const mockSignIn = async (email: string, password: string) => {
  // Try Supabase auth first
  const { data: authData, error: authError } = await signIn(email, password);
  
  // If Supabase auth succeeds, return the result
  if (!authError && authData) {
    return { data: authData, error: null };
  }
  
  // Otherwise, simulate authentication for demo
  if (email && password) {
    const role = getSimulatedRoleForEmail(email);
    return { 
      data: { user: { id: '123', email, role } }, 
      error: null 
    };
  }
  return { data: null, error: new Error('Invalid credentials') };
};

export const mockSignOut = async () => {
  // Try real signout first
  const { error } = await signOut();
  
  // Return mock response regardless
  return { error: null };
};

// Helper to simulate different roles based on email
function getSimulatedRoleForEmail(email: string): string {
  if (email.includes('student')) return 'student';
  if (email.includes('tutor')) return 'tutor';
  if (email.includes('nursing')) return 'nursing_head';
  if (email.includes('hospital')) return 'hospital_admin';
  if (email.includes('principal')) return 'principal';
  return 'student'; // Default role
}
