import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './icons/registerMdiOffline.ts';
import '@fontsource/fira-sans/latin-300.css';
import '@fontsource/fira-sans/latin-400.css';
import '@fontsource/fira-sans/latin-500.css';
import '@fontsource/fira-sans/latin-600.css';
import '@fontsource/fira-sans/latin-700.css';
import '@fontsource/fira-code/latin-400.css';
import '@fontsource/fira-code/latin-500.css';
import '@fontsource/fira-code/latin-600.css';
import '@fontsource/fira-code/latin-700.css';
import './index.css';
import App from './App.tsx';
import { I18nProvider } from './i18n/I18nProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
);
