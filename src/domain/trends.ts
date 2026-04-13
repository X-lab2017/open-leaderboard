import type { TrendJson, TrendSeries } from '../types/api';

export const EMPTY_TREND: TrendSeries = { months: [], values: [] };

export const EMPTY_TREND_PAIR = { monthly: EMPTY_TREND, yearly: EMPTY_TREND };

export const YYYY_MM_REGEX = /^\d{4}-\d{2}$/;
export const YYYY_REGEX = /^\d{4}$/;

export function getNumericValueFromJsonEntry(v: unknown): number {
  if (typeof v === 'number') return v;
  if (v && typeof v === 'object' && ('value' in v || 'openrank' in v)) {
    const o = v as { value?: unknown; openrank?: unknown };
    return Number(o.value ?? o.openrank) || 0;
  }
  return Number(v) || 0;
}

export function getTrendDataFromJson(json: TrendJson | null | undefined): TrendSeries {
  if (!json || typeof json !== 'object') return EMPTY_TREND;
  const entries = Object.entries(json)
    .filter(([k]) => YYYY_MM_REGEX.test(k))
    .sort(([a], [b]) => a.localeCompare(b));
  if (entries.length === 0) return EMPTY_TREND;
  const min = entries[0][0];
  const max = entries[entries.length - 1][0];
  const [minY, minM] = min.split('-').map(Number);
  const [maxY, maxM] = max.split('-').map(Number);
  const months: string[] = [];
  const values: number[] = [];
  const dataMap = new Map(entries.map(([k, v]) => [k, getNumericValueFromJsonEntry(v)]));
  for (let y = minY; y <= maxY; y++) {
    const startM = y === minY ? minM : 1;
    const endM = y === maxY ? maxM : 12;
    for (let m = startM; m <= endM; m++) {
      const key = `${y}-${String(m).padStart(2, '0')}`;
      months.push(key);
      values.push(dataMap.get(key) ?? 0);
    }
  }
  return { months, values };
}

export function getTrendDataFromJsonYearly(json: TrendJson | null | undefined): TrendSeries {
  if (!json || typeof json !== 'object') return EMPTY_TREND;
  const entries = Object.entries(json)
    .filter(([k]) => YYYY_REGEX.test(k))
    .sort(([a], [b]) => a.localeCompare(b));
  if (entries.length === 0) return EMPTY_TREND;
  const minY = Number(entries[0][0]);
  const maxY = Number(entries[entries.length - 1][0]);
  const dataMap = new Map(entries.map(([k, v]) => [k, getNumericValueFromJsonEntry(v)]));
  const months: string[] = [];
  const values: number[] = [];
  for (let y = minY; y <= maxY; y++) {
    const key = String(y);
    months.push(key);
    values.push(dataMap.get(key) ?? 0);
  }
  return { months, values };
}

export function pickTrendMode(bundle: { monthly: TrendSeries; yearly: TrendSeries } | undefined, mode: 'month' | 'year'): TrendSeries {
  if (!bundle) return EMPTY_TREND;
  return mode === 'year' ? bundle.yearly : bundle.monthly;
}
