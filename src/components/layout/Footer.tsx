import { Icon } from '@iconify/react/offline';
import { OPEN_DIGGER_PLATFORM_LOGO_BASE } from '../../api/constants';
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
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-slate-400 text-sm">{t('supportedBy')}</span>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-dark-700 text-slate-200 hover:bg-dark-600 hover:border-accent/50 border border-dark-600 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-dark-800"
                title="GitHub"
              >
                <Icon icon="mdi:github" className="w-7 h-7" aria-hidden />
              </a>
              <a
                href="https://atomgit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-dark-700 hover:bg-dark-600 hover:border-accent/50 border border-dark-600 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-dark-800"
                title="AtomGit"
                aria-label="AtomGit"
              >
                <img
                  src={`${OPEN_DIGGER_PLATFORM_LOGO_BASE}atomgit.png`}
                  alt=""
                  className="h-7 object-contain"
                  decoding="async"
                />
              </a>
              <a
                href="https://gitee.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-dark-700 hover:bg-dark-600 hover:border-accent/50 border border-dark-600 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-dark-800"
                title="Gitee"
                aria-label="Gitee"
              >
                <img
                  src={`${OPEN_DIGGER_PLATFORM_LOGO_BASE}gitee.png`}
                  alt=""
                  className="h-7 object-contain"
                  decoding="async"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-slate-500 text-sm font-sans">Copyright © 2026 X-lab</p>
        </div>
      </div>
    </footer>
  );
}
