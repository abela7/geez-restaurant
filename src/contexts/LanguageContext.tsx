
import * as React from 'react';
import { fetchTranslations, saveTranslation, saveTranslations } from '@/services/settings/translationService';
import { toast } from "sonner";

type LanguageContextType = {
  translations: Record<string, string>;
  setTranslations: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  currentLanguage: 'en' | 'am';
  setCurrentLanguage: React.Dispatch<React.SetStateAction<'en' | 'am'>>;
  t: (key: string, params?: Record<string, any>) => string;
  addTranslation: (key: string, value: string) => Promise<void>;
  saveAllTranslations: () => Promise<void>;
  isLoading: boolean;
};

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [translations, setTranslations] = React.useState<Record<string, string>>({});
  const [currentLanguage, setCurrentLanguage] = React.useState<'en' | 'am'>('en');
  const [initialized, setInitialized] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Load translations from database when component mounts
  React.useEffect(() => {
    const loadTranslations = async () => {
      try {
        setIsLoading(true);
        
        // First try to load from Supabase
        const dbTranslations = await fetchTranslations();
        
        // Then get any saved translations from localStorage as a backup
        const savedTranslations = localStorage.getItem('translations');
        let localTranslations = {};
        if (savedTranslations) {
          localTranslations = JSON.parse(savedTranslations);
        }
        
        // Merge both sources, with DB translations taking precedence
        const mergedTranslations = { ...localTranslations, ...dbTranslations };
        setTranslations(mergedTranslations);
        
        // Load language preference
        const savedLanguage = localStorage.getItem('language') as 'en' | 'am';
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'am')) {
          setCurrentLanguage(savedLanguage);
        }
        
        setInitialized(true);
      } catch (error) {
        console.error('Error loading translations:', error);
        toast.error("Failed to load translations");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTranslations();
  }, []);

  // Save translations to localStorage whenever they change
  React.useEffect(() => {
    if (initialized) {
      try {
        localStorage.setItem('translations', JSON.stringify(translations));
      } catch (error) {
        console.error('Error saving translations to localStorage:', error);
      }
    }
  }, [translations, initialized]);

  // Save language preference to localStorage
  React.useEffect(() => {
    if (initialized) {
      try {
        localStorage.setItem('language', currentLanguage);
        document.documentElement.lang = currentLanguage;
        document.documentElement.dir = 'ltr';
        document.documentElement.setAttribute('data-language', currentLanguage);
      } catch (error) {
        console.error('Error saving language preference:', error);
      }
    }
  }, [currentLanguage, initialized]);

  // Translation function with parameter support
  const t = (key: string, params?: Record<string, any>): string => {
    if (!key) return '';
    
    let translatedText = currentLanguage === 'en' ? key : (translations[key] || key);
    
    // Replace parameters in the translation
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translatedText = translatedText.replace(`{${param}}`, String(value));
      });
    }
    
    return translatedText;
  };

  // Add new translation - saves to database and local state
  const addTranslation = async (key: string, value: string) => {
    if (key && value) {
      try {
        // Save to local state first for immediate feedback
        setTranslations(prev => ({ ...prev, [key]: value }));
        
        // Save to database in the background
        const success = await saveTranslation(key, value);
        if (!success) {
          toast.warning("Translation saved locally but failed to save to database");
        }
      } catch (error) {
        console.error('Error adding translation:', error);
        toast.error("Failed to save translation");
      }
    }
  };

  // Save all translations to database
  const saveAllTranslations = async () => {
    try {
      setIsLoading(true);
      const success = await saveTranslations(translations);
      if (success) {
        toast.success("All translations saved to database");
      } else {
        toast.error("Failed to save translations to database");
      }
    } catch (error) {
      console.error('Error saving all translations:', error);
      toast.error("Failed to save translations to database");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        translations, 
        setTranslations, 
        currentLanguage, 
        setCurrentLanguage, 
        t,
        addTranslation,
        saveAllTranslations,
        isLoading
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translatable text component for easy usage
interface TProps {
  text: string;
  params?: Record<string, any>;
}

export const T: React.FC<TProps> = ({ text, params }) => {
  const { t } = useLanguage();
  return <>{t(text, params)}</>;
};
