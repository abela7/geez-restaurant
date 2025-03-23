
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Home, ChefHat, Coffee, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  const { t } = useLanguage();
  
  // Function to get the parent route for the "Back" button
  const getParentRoute = () => {
    const path = window.location.pathname;
    
    // Get parent path by removing the last segment
    const segments = path.split('/').filter(Boolean);
    segments.pop();
    
    if (segments.length === 0) return '/';
    return '/' + segments.join('/');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <Coffee className="h-24 w-24 text-amber-500" />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            <T text="Page Not Found" />
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            <T text="The page you are looking for doesn't exist or has been moved." />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/admin">
                <Home className="mr-2 h-4 w-4" />
                <T text="Go to Dashboard" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={getParentRoute()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                <T text="Go Back" />
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/menu">
                <ChefHat className="mr-2 h-4 w-4" />
                <T text="View Our Menu" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default NotFound;
