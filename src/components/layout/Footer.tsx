import { Icon } from '@iconify/react';
import { useI18n } from '../../i18n/I18nProvider';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-dark-800 border-t border-dark-600 mt-12">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm">{t('dataPoweredBy')}</span>
            <a
              href="https://open-digger.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-dark-700 border border-dark-600 hover:bg-dark-600 hover:border-accent/50 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-dark-800"
              title="OpenDigger"
            >
              <img
                src="https://open-digger.cn/open_leaderboard/images/open_digger_logo.png"
                alt="OpenDigger Logo"
                className="h-7 object-contain"
              />
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm">{t('supportedBy')}</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-dark-700 text-slate-200 hover:bg-dark-600 hover:border-accent/50 border border-dark-600 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-dark-800"
              title="GitHub"
            >
              <Icon icon="mdi:github" className="text-xl" aria-hidden />
            </a>
          </div>
        </div>
        <div className="text-center">
          <p className="text-slate-500 text-sm font-sans">Copyright © 2026 X-lab</p>
        </div>
      </div>
    </footer>
  );
}
