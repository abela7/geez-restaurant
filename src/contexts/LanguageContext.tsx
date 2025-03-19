
import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageContextType = {
  translations: Record<string, string>;
  setTranslations: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  currentLanguage: 'en' | 'am';
  setCurrentLanguage: React.Dispatch<React.SetStateAction<'en' | 'am'>>;
  t: (key: string) => string;
  addTranslation: (key: string, value: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'am'>('en');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Load translations from localStorage if they exist
    try {
      const savedTranslations = localStorage.getItem('translations');
      if (savedTranslations) {
        setTranslations(JSON.parse(savedTranslations));
      }

      // Load language preference from localStorage if it exists
      const savedLanguage = localStorage.getItem('language') as 'en' | 'am';
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'am')) {
        setCurrentLanguage(savedLanguage);
      }
      
      setInitialized(true);
    } catch (error) {
      console.error('Error loading language settings:', error);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    // Only save to localStorage after initial load
    if (initialized) {
      try {
        // Save translations to localStorage whenever they change
        localStorage.setItem('translations', JSON.stringify(translations));
      } catch (error) {
        console.error('Error saving translations:', error);
      }
    }
  }, [translations, initialized]);

  useEffect(() => {
    // Only save to localStorage after initial load
    if (initialized) {
      try {
        // Save language preference to localStorage whenever it changes
        localStorage.setItem('language', currentLanguage);
        
        // Update document attributes for better accessibility
        document.documentElement.lang = currentLanguage;
        document.documentElement.dir = 'ltr'; // Both English and Amharic are left-to-right
        
        // Add a data attribute for potential CSS customization
        document.documentElement.setAttribute('data-language', currentLanguage);
      } catch (error) {
        console.error('Error saving language preference:', error);
      }
    }
  }, [currentLanguage, initialized]);

  // Translation function
  const t = (key: string): string => {
    if (!key) return '';
    if (currentLanguage === 'en') return key;
    return translations[key] || key;
  };

  // Add new translation
  const addTranslation = (key: string, value: string) => {
    if (key && value) {
      setTranslations(prev => ({ ...prev, [key]: value }));
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
        addTranslation
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translatable text component for easy usage
export const T: React.FC<{ text: string }> = ({ text }) => {
  const { t } = useLanguage();
  return <>{t(text)}</>;
};
