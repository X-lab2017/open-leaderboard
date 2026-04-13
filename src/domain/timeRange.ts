import type { Lang, LeaderboardMeta } from '../types/api';
import { translations } from '../i18n/translations';

export function getTimeBounds(meta: LeaderboardMeta | null) {
  const baseDate = meta?.updatedAt ? new Date(meta.updatedAt) : new Date();
  baseDate.setMonth(baseDate.getMonth() - 1);
  return {
    minYear: 2015,
    maxYear: baseDate.getFullYear(),
    maxMonth: `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, '0')}`,
  };
}

export function getLastMonth(baseDate: string | number | Date | null = null): string {
  const date = baseDate ? new Date(baseDate) : new Date();
  date.setMonth(date.getMonth() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function formatTimeDisplay(value: string, timeType: 'month' | 'year', lang: Lang): string {
  if (timeType === 'year') {
    return translations[lang].timeYearDisplay.replace('{{y}}', value);
  }
  const [y, m] = value.split('-');
  return `${y}.${m}`;
}

/** Initial time value when switching type or loading filters */
export function computeInitialTimeValue(
  timeType: 'month' | 'year',
  meta: LeaderboardMeta | null,
  previousValue: string,
): string {
  const bounds = getTimeBounds(meta);
  if (timeType === 'year') {
    let yearVal = bounds.maxYear.toString();
    if (previousValue) {
      const parsed = previousValue.includes('-')
        ? parseInt(previousValue.split('-')[0], 10)
        : parseInt(previousValue, 10);
      if (!isNaN(parsed) && parsed >= 2015 && parsed <= bounds.maxYear) yearVal = String(parsed);
    }
    return yearVal;
  }
  let monthVal: string;
  if (previousValue && /^\d{4}-\d{2}$/.test(previousValue)) {
    monthVal = previousValue;
  } else if (previousValue && /^\d{4}$/.test(previousValue)) {
    monthVal = `${previousValue}-12`;
  } else {
    monthVal = getLastMonth(meta?.updatedAt || null);
  }
  if (monthVal < '2015-01') monthVal = '2015-01';
  if (monthVal > bounds.maxMonth) monthVal = bounds.maxMonth;
  return monthVal;
}
