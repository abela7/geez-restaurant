import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/ThemeProvider';
import { toast } from '@/components/ui/use-toast';

// Mock users for demo
const users = [
  { 
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'waiter',
    password: 'waiter123',
    role: 'waiter'
  },
  {
    username: 'kitchen',
    password: 'kitchen123',
    role: 'kitchen'
  }
];

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication check
    setTimeout(() => {
      const user = users.find(
        u => u.username === username && u.password === password
      );
      
      if (user) {
        // For a real app, store tokens in localStorage and manage a proper auth state
        localStorage.setItem('user', JSON.stringify({ username, role: user.role }));
        toast({
          title: "Login successful",
          description: `Welcome back, ${username}!`,
        });
        
        // Redirect based on user role
        if (user.role === 'waiter') {
          navigate('/waiter');
        } else if (user.role === 'kitchen') {
          navigate('/kitchen');
        } else {
          navigate('/');
        }
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <div className="flex space-x-2">
          <button 
            onClick={() => setTheme('light')} 
            className={`p-2 rounded-md ${theme === 'light' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </button>
          <button 
            onClick={() => setTheme('dark')} 
            className={`p-2 rounded-md ${theme === 'dark' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
          <button 
            onClick={() => setTheme('high-contrast')} 
            className={`p-2 rounded-md ${theme === 'high-contrast' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2v20M2 12h20"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-primary">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mt-4">Habesha Restaurant Manager</h1>
          <p className="text-muted-foreground">Login to access your dashboard</p>
        </div>
        
        <Card className="card-custom">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium" htmlFor="username">
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="input-custom"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium" htmlFor="password">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-custom"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="rounded text-primary focus:ring-primary"
                    />
                    <label htmlFor="remember" className="text-sm">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">
                    Quick access
                  </span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-3">
                <Button 
                  variant="outline" 
                  className="hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    setUsername('admin');
                    setPassword('admin123');
                  }}
                >
                  Admin
                </Button>
                <Button 
                  variant="outline" 
                  className="hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    setUsername('waiter');
                    setPassword('waiter123');
                  }}
                >
                  Waiter
                </Button>
                <Button 
                  variant="outline" 
                  className="hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    setUsername('kitchen');
                    setPassword('kitchen123');
                  }}
                >
                  Kitchen
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        <p className="text-center mt-6 text-sm text-muted-foreground">
          This is a demo version. Use the quick access buttons for predefined accounts.
        </p>
      </div>
    </div>
  );
};

export default Login;
