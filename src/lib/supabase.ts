
import { createClient } from '@supabase/supabase-js';

// Note: This is a placeholder approach. In a real application with Supabase integration, 
// you would use environment variables and proper configuration.
// For this demo, we're using a placeholder approach to show the structure.

// In a real implementation with Supabase integration, you would use:
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const demoSupabaseUrl = 'https://placeholder-project.supabase.co';
const demoSupabaseAnonKey = 'demo-key';

export const supabase = createClient(demoSupabaseUrl, demoSupabaseAnonKey);

// Mock functions for demo purposes
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
