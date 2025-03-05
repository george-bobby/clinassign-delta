
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

// Create a common response function to ensure consistent return shapes
const createMockResponse = (data: any = null, error: any = null) => {
  return { data, error };
};

// Helper to mock async operations
const mockAsync = async (data: any = null, error: any = null, delay = 300) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return createMockResponse(data, error);
};

// Create a mock query builder that's Promise-compatible
const createQueryBuilder = () => {
  let mockData: any[] = [];
  
  const queryBuilder = {
    data: null as any,
    error: null as any,

    // Filter methods that return the query builder itself
    eq: (column: string, value: any) => queryBuilder,
    neq: (column: string, value: any) => queryBuilder,
    gt: (column: string, value: any) => queryBuilder,
    gte: (column: string, value: any) => queryBuilder,
    lt: (column: string, value: any) => queryBuilder,
    lte: (column: string, value: any) => queryBuilder,
    like: (column: string, value: any) => queryBuilder,
    ilike: (column: string, value: any) => queryBuilder,
    is: (column: string, value: any) => queryBuilder,
    in: (column: string, values: any[]) => queryBuilder,
    contains: (column: string, value: any) => queryBuilder,
    containedBy: (column: string, value: any) => queryBuilder,
    rangeGt: (column: string, range: any) => queryBuilder,
    rangeGte: (column: string, range: any) => queryBuilder,
    rangeLt: (column: string, range: any) => queryBuilder,
    rangeLte: (column: string, range: any) => queryBuilder,
    rangeAdjacent: (column: string, range: any) => queryBuilder,
    overlaps: (column: string, value: any) => queryBuilder,
    textSearch: (column: string, query: string, options?: any) => queryBuilder,
    filter: (column: string, operator: string, value: any) => queryBuilder,
    not: (column: string, operator: string, value: any) => queryBuilder,
    or: (filters: string, options?: any) => queryBuilder,

    // Result modifiers
    order: (column: string, options?: any) => queryBuilder,
    limit: (count: number) => queryBuilder,
    range: (from: number, to: number) => queryBuilder,
    
    // Execution methods that return Promises directly
    single: async () => await mockAsync(null, null),
    maybeSingle: async () => await mockAsync(null, null),
    execute: async () => await mockAsync(mockData, null),
    
    // For compatibility with code using .then
    then: (callback: Function) => Promise.resolve(mockAsync(mockData, null)).then(callback)
  };
  
  return queryBuilder;
};

// Fixed count method for compatibility
const countBuilder = {
  execute: async () => await mockAsync({ count: 0 }, null)
};

// Create a mock supabase object that can be used as a drop-in replacement
export const supabase = {
  auth: {
    getSession: async () => {
      return { data: { session: null }, error: null };
    },
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
      // Return an object that mimics the Supabase subscription
      return { 
        data: { subscription: { unsubscribe: () => {} } },
        error: null
      };
    }
  },
  from: (table: string) => {
    return {
      select: (query = '*') => {
        const builder = createQueryBuilder();
        
        // Add proper count method
        builder.count = (options?: any) => countBuilder;
        
        return builder;
      },
      insert: (data: any) => {
        return {
          select: (query = '*') => {
            return {
              single: async () => await mockAsync({ ...data, id: 'mock-id' }, null, 500)
            };
          },
          execute: async () => await mockAsync({ ...data, id: 'mock-id' }, null, 500)
        };
      },
      update: (data: any) => {
        return {
          eq: (column: string, value: any) => {
            return {
              execute: async () => await mockAsync(null, null, 400)
            };
          },
          execute: async () => await mockAsync(null, null, 400)
        };
      },
      delete: () => {
        return {
          eq: (column: string, value: any) => {
            return {
              execute: async () => await mockAsync(null, null, 400)
            };
          },
          execute: async () => await mockAsync(null, null, 400)
        };
      },
      count: (options?: any) => countBuilder
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
