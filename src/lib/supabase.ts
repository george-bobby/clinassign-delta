
// Mock auth functions to replace Supabase functionality

// Mock current user based on localStorage
const getMockCurrentUser = () => {
  const storedUser = localStorage.getItem('clinassign_user');
  return storedUser ? JSON.parse(storedUser) : null;
};

// Mock sign in function
export const signIn = async (email: string, password: string) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Very basic validation
  if (email && password) {
    const role = getSimulatedRoleForEmail(email);
    const user = { 
      id: '123', 
      email, 
      role,
      name: email.split('@')[0]
    };
    
    // Store in localStorage for persistence
    localStorage.setItem('clinassign_user', JSON.stringify(user));
    
    return { data: { user }, error: null };
  }
  
  return { data: null, error: new Error('Invalid credentials') };
};

// Mock sign up function
export const signUp = async (email: string, password: string, metadata: any) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Very basic validation
  if (email && password && metadata) {
    const user = {
      id: '123',
      email,
      role: metadata.role || 'student',
      name: metadata.name || email.split('@')[0]
    };
    
    // Store in localStorage for persistence
    localStorage.setItem('clinassign_user', JSON.stringify(user));
    
    return { data: { user }, error: null };
  }
  
  return { data: null, error: new Error('Invalid registration data') };
};

// Mock sign out function
export const signOut = async () => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Clear stored user
  localStorage.removeItem('clinassign_user');
  
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

// Export the mock auth functions for compatibility
export const mockSignIn = signIn;
export const mockSignOut = signOut;

// Create a mock supabase object that can be used as a drop-in replacement
export const supabase = {
  auth: {
    signInWithPassword: async (credentials: { email: string, password: string }) => {
      return signIn(credentials.email, credentials.password);
    },
    signUp: async (credentials: { email: string, password: string, options?: { data: any } }) => {
      return signUp(credentials.email, credentials.password, credentials.options?.data);
    },
    signOut: async () => {
      return signOut();
    },
    getUser: async () => {
      const user = getMockCurrentUser();
      return { data: { user }, error: null };
    },
    onAuthStateChange: (callback: Function) => {
      // This is a no-op in our mock implementation
      return { 
        subscription: { 
          unsubscribe: () => {} 
        } 
      };
    }
  },
  from: (table: string) => {
    return {
      select: (query = '*') => {
        return {
          eq: (column: string, value: any) => {
            return {
              single: async () => {
                // Simulate network request
                await new Promise(resolve => setTimeout(resolve, 300));
                return { data: null, error: null };
              },
              order: (column: string, options = {}) => {
                return {
                  limit: (limit: number) => {
                    return {
                      then: async () => {
                        // Simulate network request
                        await new Promise(resolve => setTimeout(resolve, 300));
                        return { data: [], error: null };
                      }
                    };
                  }
                };
              }
            };
          },
          order: (column: string, options = {}) => {
            return {
              then: async () => {
                // Simulate network request
                await new Promise(resolve => setTimeout(resolve, 300));
                return { data: [], error: null };
              }
            };
          }
        };
      },
      insert: (data: any) => {
        return {
          select: (query = '*') => {
            return {
              single: async () => {
                // Simulate network request
                await new Promise(resolve => setTimeout(resolve, 500));
                return { data: { ...data, id: 'mock-id' }, error: null };
              }
            };
          }
        };
      },
      update: (data: any) => {
        return {
          eq: (column: string, value: any) => {
            return {
              then: async () => {
                // Simulate network request
                await new Promise(resolve => setTimeout(resolve, 400));
                return { data: null, error: null };
              }
            };
          }
        };
      },
      delete: () => {
        return {
          eq: (column: string, value: any) => {
            return {
              then: async () => {
                // Simulate network request
                await new Promise(resolve => setTimeout(resolve, 400));
                return { data: null, error: null };
              }
            };
          }
        };
      }
    };
  },
  // Add mock function for Supabase Realtime
  channel: (name: string) => {
    return {
      on: (event: string, options: any, callback: Function) => {
        return {
          subscribe: () => {
            return {
              // Just return a mock subscription
            };
          }
        };
      }
    };
  },
  removeChannel: (channel: any) => {
    // No-op in our mock implementation
  },
  functions: {
    invoke: async (name: string, options = {}) => {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 600));
      return { data: {}, error: null };
    }
  }
};
