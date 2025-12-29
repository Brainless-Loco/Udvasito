import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get saved language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('udvasito_language');
    return savedLanguage || 'en';
  });

  const [t, setT] = useState(translations[language]);

  useEffect(() => {
    // Update translations when language changes
    setT(translations[language]);
    // Save language preference to localStorage
    localStorage.setItem('udvasito_language', language);
    // Update document direction for RTL languages if needed
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  // Helper function to get nested translation
  const translate = (key) => {
    const keys = key.split('.');
    let result = t;
    for (const k of keys) {
      result = result?.[k];
    }
    return result || key;
  };

  const value = {
    language,
    t,
    toggleLanguage,
    changeLanguage,
    translate,
    isEnglish: language === 'en',
    isBangla: language === 'bn',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
