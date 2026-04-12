import { useState, useEffect, createContext, useContext } from 'react';
import { publicApi } from '../api';

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    publicApi.getSiteSettings()
      .then(({ data }) => setSettings(data))
      .catch(() => {});
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export default function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
