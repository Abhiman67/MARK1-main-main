// Authentication utilities and types

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Mock authentication functions (replace with real implementation)
export const authService = {
  async signIn(email: string, password: string): Promise<{ user: User; token: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const user: User = {
      id: '1',
      email,
      firstName: 'John',
      lastName: 'Doe',
      avatar: '/avatars/john-doe.jpg',
      createdAt: new Date(),
      lastLoginAt: new Date()
    };

    const token = 'mock-jwt-token';
    
    // Store token in localStorage (in real app, use secure storage)
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }

    return { user, token };
  },

  async signUp(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user: User = {
      id: Date.now().toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      createdAt: new Date()
    };

    const token = 'mock-jwt-token';
    
    // Store token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }

    return { user, token };
  },

  async signOut(): Promise<void> {
    // Clear stored data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem('auth-token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  },

  async resetPassword(email: string): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In real app, send reset email
  }
};

// Auth context hook (for use with React Context)
export const useAuth = () => {
  // Get user from localStorage
  let user: User | null = null;
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        user = JSON.parse(userData);
      } catch {
        user = null;
      }
    }
  }
  
  return {
    user,
    isLoading: false,
    isAuthenticated: !!user,
    signIn: authService.signIn,
    signUp: authService.signUp,
    signOut: authService.signOut
  };
};