
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

const supabaseUrl = 'https://twfqgsicgntlukuciivo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3ZnFnc2ljZ250bHVrdWNpaXZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MTcyNDIsImV4cCI6MjA1NjI5MzI0Mn0.NUwex35KLh1eqmJJzOdtKkw5yT6zMQsuY2v7g2E688c';

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
  // Simulate authentication for demo
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
