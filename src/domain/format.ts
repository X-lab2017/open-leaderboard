import type { Lang } from '../types/api';
import { translations } from '../i18n/translations';

export function formatUpdateTime(timestamp: string | null | undefined, lang: Lang): string {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const tpl = translations[lang].metaUpdateTime;
  if (lang === 'zh') {
    const month = date.getMonth() + 1;
    return tpl.replace('{{year}}', String(year)).replace('{{month}}', String(month));
  }
  const monthLong = date.toLocaleString('en', { month: 'long' });
  return tpl.replace('{{month}}', monthLong).replace('{{year}}', String(year));
}
