
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

  useEffect(() => {
    // Load translations from localStorage if they exist
    const savedTranslations = localStorage.getItem('translations');
    if (savedTranslations) {
      setTranslations(JSON.parse(savedTranslations));
    }

    // Load language preference from localStorage if it exists
    const savedLanguage = localStorage.getItem('language') as 'en' | 'am';
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Save translations to localStorage whenever they change
    localStorage.setItem('translations', JSON.stringify(translations));
  }, [translations]);

  useEffect(() => {
    // Save language preference to localStorage whenever it changes
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  // Translation function
  const t = (key: string): string => {
    if (currentLanguage === 'en') return key;
    return translations[key] || key;
  };

  // Add new translation
  const addTranslation = (key: string, value: string) => {
    setTranslations(prev => ({ ...prev, [key]: value }));
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
