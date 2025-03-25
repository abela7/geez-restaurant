
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing user on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Check local storage first for our mock auth
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  // Login function
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
      
      // Clear state
      setUser(null);
      
      // Show success message
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      // Redirect to login
      navigate('/login');
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
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
