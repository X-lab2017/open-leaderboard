import { Icon } from '@iconify/react/offline';
import { useI18n } from '../../i18n/I18nProvider';

export function Header() {
  const { t, toggleLanguage } = useI18n();

  return (
    <header className="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto">
      <div className="bg-dark-800/95 backdrop-blur-sm border border-dark-600 rounded-xl shadow-xl px-4 md:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <img
              src="https://open-digger.cn/open_leaderboard/images/logo.png"
              alt="OpenLeaderboard Logo"
              className="h-9 w-9 object-contain"
            />
            <span className="text-lg font-mono font-semibold text-slate-100">OpenLeaderboard</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://open-digger.cn"
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-dark-700 text-slate-200 hover:bg-dark-600 hover:border-accent/50 border border-dark-600 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-dark-900"
            >
              <img
                src="https://open-digger.cn/open_leaderboard/images/open_digger_logo.png"
                alt=""
                className="h-8 w-auto object-contain"
                aria-hidden
              />
              OpenDigger
            </a>
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-700 text-slate-200 hover:bg-dark-600 hover:border-accent/50 border border-dark-600 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-dark-900"
              onClick={toggleLanguage}
            >
              <Icon icon="mdi:translate" className="text-lg" />
              <span>{t('languageText')}</span>
            </button>
            <a
              href="https://github.com/X-lab2017/open-digger"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-dark-700 text-slate-200 hover:bg-dark-600 hover:border-accent/50 border border-dark-600 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-dark-900"
              aria-label="GitHub"
            >
              <Icon icon="mdi:github" className="text-xl" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
