import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Lang } from '../types/api';
import { translations } from './translations';

const STORAGE_KEY = 'language';

type I18nCtx = {
  lang: Lang;
  t: (key: string) => string;
  toggleLanguage: () => void;
};

const I18nContext = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const s = localStorage.getItem(STORAGE_KEY);
    return s === 'en' ? 'en' : 'zh';
  });

  const t = useCallback(
    (key: string) => {
      return translations[lang][key] || key;
    },
    [lang],
  );

  const toggleLanguage = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === 'zh' ? 'en' : 'zh';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = translations[lang].documentTitle;
  }, [lang]);

  const value = useMemo(() => ({ lang, t, toggleLanguage }), [lang, t, toggleLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook paired with provider in one module
export function useI18n(): I18nCtx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
