import { useState, useEffect } from 'react';
import { publicApi } from '../api';
import useLanguage from './useLanguage';

export default function usePageData(slug) {
  const { language } = useLanguage();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    publicApi.getPage(slug, language)
      .then(({ data }) => {
        if (!cancelled) setSections(data.sections || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug, language]);

  const getSection = (type) => sections.find((s) => s.section_type === type);
  const getSections = (type) => sections.filter((s) => s.section_type === type);

  return { sections, loading, error, getSection, getSections };
}
