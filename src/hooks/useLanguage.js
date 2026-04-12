import React, { createContext, useContext, useState, useCallback } from 'react';

const LanguageContext = createContext();

const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'am', label: 'AM', name: 'Հայերեն' },
];

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const stored = localStorage.getItem('lang');
    if (stored === 'hy') return 'am';
    return stored || 'en';
  });

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    localStorage.setItem('lang', lang);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export default function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider');
  return ctx;
}
