
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Home, ChefHat, Coffee } from 'lucide-react';

const NotFound: React.FC = () => {
  const { t } = useLanguage();

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <Coffee className="h-24 w-24 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            <T text="Page Not Found" />
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            <T text="The page you are looking for doesn't exist or has been moved." />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                <T text="Go to Home" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
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
