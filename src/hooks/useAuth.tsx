
import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type User = {
  id: string;
  username: string;
  role: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_id?: string;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
  error: null,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

// Mock users for demo until we integrate Supabase Auth fully
const MOCK_USERS = [
  { 
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@habesharestaurant.com'
  },
  {
    id: '2',
    username: 'waiter',
    password: 'waiter123',
    role: 'waiter',
    first_name: 'Waiter',
    last_name: 'Staff',
    email: 'waiter@habesharestaurant.com'
  },
  {
    id: '3',
    username: 'kitchen',
    password: 'kitchen123',
    role: 'kitchen',
    first_name: 'Kitchen',
    last_name: 'Staff',
    email: 'kitchen@habesharestaurant.com'
  },
  {
    id: '4',
    username: 'tsion',
    password: 'tsion123',
    role: 'waiter',
    first_name: 'Tsion',
    last_name: 'Alemayehu',
    email: 'tsion@habesharestaurant.com'
  }
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const isInIframe = window.top !== window.self;
  console.log("AuthProvider initializing. In iframe:", isInIframe);
  
  // For development, automatically set Tsion as the user
  const tsionUser = MOCK_USERS.find(u => u.username === 'tsion');
  const defaultUser = tsionUser ? { ...tsionUser, password: undefined } : null;
  
  const [user, setUser] = useState<User | null>(defaultUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Debug log for auth state
    console.log("Auth state initialized:", { user, isAuthenticated: !!user });
    
    // Store Tsion user in localStorage to ensure consistency
    if (defaultUser && !localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify(defaultUser));
    } else if (localStorage.getItem('user')) {
      // Load from localStorage if exists
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '');
        if (storedUser && storedUser.id) {
          console.log("Loaded user from localStorage:", storedUser.username);
          setUser(storedUser);
        }
      } catch (e) {
        console.error("Error parsing stored user:", e);
        // If there's an error, reset to default user
        setUser(defaultUser);
      }
    }
    
    // Force auth in iframe environments to avoid auth issues
    if (isInIframe) {
      console.log("In iframe environment - forcing auth state");
      setUser(defaultUser);
      localStorage.setItem('user', JSON.stringify(defaultUser));
    }
  }, [isInIframe]);

  // Login function (still available but not needed for development)
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user in mock data
      const foundUser = MOCK_USERS.find(
        u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );
      
      if (foundUser) {
        // Create a clean user object without the password
        const { password: _, ...userWithoutPassword } = foundUser;
        
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        // Update state
        setUser(userWithoutPassword);
        
        // Show success message
        toast({
          title: "Login successful",
          description: `Welcome, ${foundUser.first_name || username}!`,
        });
        
        // Redirect based on role
        if (foundUser.role === 'waiter') {
          navigate('/waiter');
        } else if (foundUser.role === 'kitchen') {
          navigate('/kitchen');
        } else {
          navigate('/admin');
        }
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Login failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      // Clear local storage
      localStorage.removeItem('user');
      
      // Reset to Tsion for development (normally would set to null)
      setUser(defaultUser);
      
      // Show success message
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      // For development, redirect to waiter dashboard instead of login
      navigate('/waiter');
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Logout failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        error,
        isAuthenticated: true // Always authenticated for development
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
