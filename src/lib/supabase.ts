
// Mock Supabase client for frontend development without backend

const mockData = {
  users: [
    { 
      id: '1', 
      email: 'student@example.com', 
      role: 'student',
      name: 'Student User',
      avatar: null
    },
    { 
      id: '2', 
      email: 'tutor@example.com', 
      role: 'tutor',
      name: 'Tutor User',
      avatar: null
    },
    { 
      id: '3', 
      email: 'head@example.com', 
      role: 'nursing_head',
      name: 'Nursing Head',
      avatar: null
    }
  ],
  // Add other mock data as needed
};

class MockQuery {
  private table: string;
  private filters: any = {};
  private orderingColumn: string | null = null;
  private orderingDirection: 'asc' | 'desc' = 'asc';
  private limitCount: number | null = null;
  private selectQuery: string | null = null;
  private inValues: any[] = [];
  private inColumn: string | null = null;
  private mockData: any = null;

  constructor(table: string) {
    this.table = table;
  }

  // Filter methods
  eq(column: string, value: any) {
    this.filters[column] = { type: 'eq', value };
    return this;
  }

  neq(column: string, value: any) {
    this.filters[column] = { type: 'neq', value };
    return this;
  }

  gt(column: string, value: any) {
    this.filters[column] = { type: 'gt', value };
    return this;
  }

  gte(column: string, value: any) {
    this.filters[column] = { type: 'gte', value };
    return this;
  }

  lt(column: string, value: any) {
    this.filters[column] = { type: 'lt', value };
    return this;
  }

  lte(column: string, value: any) {
    this.filters[column] = { type: 'lte', value };
    return this;
  }

  in(column: string, values: any[]) {
    this.inColumn = column;
    this.inValues = values;
    return this;
  }

  is(column: string, value: any) {
    this.filters[column] = { type: 'is', value };
    return this;
  }

  // Query building methods
  select(query: string = '*') {
    this.selectQuery = query;
    return this;
  }

  order(column: string, options: { ascending?: boolean } = {}) {
    this.orderingColumn = column;
    this.orderingDirection = options.ascending !== false ? 'asc' : 'desc';
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  // Data modification methods
  insert(data: any) {
    return {
      execute: async () => {
        console.log('Mock insert:', data);
        return {
          data: { ...data, id: `mock-${Date.now()}` },
          error: null
        };
      }
    };
  }

  update(data: any) {
    return {
      eq: (column: string, value: any) => {
        return {
          execute: async () => {
            console.log(`Mock update where ${column} = ${value}:`, data);
            return {
              data: { ...data, id: value },
              error: null
            };
          }
        };
      },
      execute: async () => {
        console.log('Mock update:', data);
        return {
          data,
          error: null
        };
      }
    };
  }

  delete() {
    return {
      eq: (column: string, value: any) => {
        return {
          execute: async () => {
            console.log(`Mock delete where ${column} = ${value}`);
            return {
              data: { id: value },
              error: null
            };
          }
        };
      },
      execute: async () => {
        console.log('Mock delete all');
        return {
          data: null,
          error: null
        };
      }
    };
  }

  // Mock specific methods for testing
  mockResponse(response: any) {
    this.mockData = response;
    return this;
  }

  single() {
    return {
      data: null,
      error: null,
      async execute() {
        // This would perform the actual filtering in a real implementation
        return {
          data: null,
          error: null
        };
      }
    };
  }

  // This functions as both an async call and a chainable method
  async execute() {
    // If we have a mock response, return it
    if (this.mockData) {
      return this.mockData;
    }

    // In a real implementation this would query the actual data
    return {
      data: [],
      error: null
    };
  }

  // Support for common promise pattern
  async then(callback: (value: { data: any; error: any }) => any) {
    const result = await this.execute();
    return callback(result);
  }

  // Count method for aggregations
  async count() {
    // In a real implementation this would count matching records
    return {
      data: 0,
      error: null
    };
  }
}

// Set up the actual mock client
const supabase = {
  from: (table: string) => {
    return new MockQuery(table);
  },

  auth: {
    signUp: async (credentials: { 
      email: string; 
      password: string; 
      options?: { 
        data?: any 
      } 
    }) => {
      // Simulate successful signup
      const userData = credentials.options?.data || {};
      return {
        data: {
          user: {
            id: 'new-user-id',
            email: credentials.email,
            role: userData?.role || 'student',
            name: userData?.name || credentials.email.split('@')[0]
          }
        },
        error: null
      };
    },

    signInWithPassword: async (credentials: { email: string; password: string }) => {
      // Find matching user in mock data
      const user = mockData.users.find(u => u.email === credentials.email);
      
      if (user) {
        return {
          data: { user },
          error: null
        };
      }
      
      return {
        data: null,
        error: new Error('Invalid login credentials')
      };
    },

    signOut: async () => {
      return {
        error: null
      };
    },

    getUser: async () => {
      // Return a mock logged-in user
      return {
        data: { user: mockData.users[0] },
        error: null
      };
    },

    getSession: async () => {
      // Return a mock session
      return {
        data: { 
          session: {
            user: mockData.users[0]
          }
        },
        error: null
      };
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Return a mock unsubscribe function
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }
  },

  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        return {
          data: { path },
          error: null
        };
      },
      getPublicUrl: (path: string) => {
        return { 
          data: { publicUrl: `https://mock-storage-url.com/${path}` }
        };
      }
    })
  },

  // Add realtime subscription support
  channel: (channel: string) => {
    return {
      on: (event: string, config: any, callback: (payload: any) => void) => {
        console.log(`Subscribed to ${channel} for ${event}`);
        // Return this for chaining
        return {
          subscribe: () => {
            console.log(`Subscription to ${channel} activated`);
            return {
              unsubscribe: () => {
                console.log(`Unsubscribed from ${channel}`);
              }
            };
          }
        };
      }
    };
  },

  removeChannel: (channel: any) => {
    console.log('Channel removed:', channel);
    return true;
  }
};

export { supabase };
