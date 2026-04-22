import type { LeaderboardMeta } from '../types/api';
import { normalizeRepoPlatform } from './repoPlatform';
import { getTimeBounds, type TimeBounds } from './timeRange';

/** Raw JSON: period key -> [platform, id, login, score][] */
export type CommunityOpenRankDetailsFile = Record<string, unknown>;

export type CommunityOpenRankRow = {
  platform: string;
  id: string;
  login: string;
  score: number;
};

export type CommunityOpenRankDisplayRow = CommunityOpenRankRow & {
  rank: number;
  rankDelta: number | null;
  openrankDelta: number | null;
  avatarUrl: string;
};

function rowKey(r: CommunityOpenRankRow): string {
  return `${r.platform}\0${r.id}\0${r.login}`;
}

export function parseOpenRankDetailTuple(entry: unknown): CommunityOpenRankRow | null {
  if (!Array.isArray(entry) || entry.length < 4) return null;
  const platform = String(entry[0] ?? '');
  const id = String(entry[1] ?? '');
  const login = String(entry[2] ?? '');
  const score = Number(entry[3]);
  if (!platform || !login || Number.isNaN(score)) return null;
  return { platform, id, login, score };
}

export function communityOpenRankAvatarUrl(row: CommunityOpenRankRow): string {
  const login = row.login.split('/')[0] || row.login;
  const p = row.platform.trim();
  if (p === 'GitHub' || p.toLowerCase() === 'github') {
    return `https://github.com/${login}.png`;
  }
  if (p === 'Gitee' || p.toLowerCase() === 'gitee') {
    return `https://gitee.com/${login}.png`;
  }
  if (p === 'GitLab' || p.toLowerCase() === 'gitlab') {
    return `https://gitlab.com/uploads/-/system/user/avatar/${row.id}/avatar.png`;
  }
  if (p === 'AtomGit' || p.toLowerCase() === 'atomgit') {
    return `https://atomgit.com/${login}.png`;
  }
  return '';
}

/**
 * 当 LeaderboardItem 无 avatar（例如 ?dashboard= 深链仅含 platform/login）时，按平台推断头像 URL。
 * GitLab 需要 OpenDigger user meta 中的数字 id；其余平台仅用 login 即可。
 */
export function inferredDeveloperAvatarUrl(
  platform: unknown,
  login: string,
  ossNumericUserId?: string | null,
): string {
  const handle = (login || '').split('/')[0]?.trim() || '';
  if (!handle) return '';
  const slug = normalizeRepoPlatform(platform);
  if (slug === 'gitlab') {
    const id = String(ossNumericUserId ?? '').trim();
    if (!id) return '';
  }
  return communityOpenRankAvatarUrl({
    platform: slug,
    id: String(ossNumericUserId ?? '').trim(),
    login: handle,
    score: 0,
  });
}

export function communityOpenRankPeriodKey(timeType: 'month' | 'year', timeValue: string): string {
  if (timeType === 'year') return timeValue;
  return timeValue;
}

/** Min/max selectable periods from JSON keys (array values only). */
export function getCommunityOpenRankDataBounds(
  details: CommunityOpenRankDetailsFile,
  timeType: 'month' | 'year',
): TimeBounds | null {
  const keys = Object.keys(details).filter((k) => {
    const v = details[k];
    if (!Array.isArray(v)) return false;
    if (timeType === 'year') return /^\d{4}$/.test(k);
    return /^\d{4}-\d{2}$/.test(k);
  });
  if (keys.length === 0) return null;
  if (timeType === 'year') {
    const years = keys.map((k) => parseInt(k, 10)).filter((y) => !Number.isNaN(y));
    if (years.length === 0) return null;
    const minY = Math.min(...years);
    const maxY = Math.max(...years);
    return {
      minYear: minY,
      maxYear: maxY,
      minMonth: `${minY}-01`,
      maxMonth: `${maxY}-12`,
    };
  }
  const sorted = [...keys].sort();
  const minMonth = sorted[0]!;
  const maxMonth = sorted[sorted.length - 1]!;
  const minY = parseInt(minMonth.slice(0, 4), 10);
  const maxY = parseInt(maxMonth.slice(0, 4), 10);
  return {
    minYear: minY,
    maxYear: maxY,
    minMonth,
    maxMonth,
  };
}

export function previousCommunityOpenRankPeriodKey(
  timeType: 'month' | 'year',
  timeValue: string,
  meta: LeaderboardMeta | null,
  dataBounds: TimeBounds | null = null,
): string | null {
  const bounds = dataBounds ?? getTimeBounds(meta);
  const minMonth = bounds.minMonth;
  const strictDataMin = dataBounds != null;
  if (timeType === 'year') {
    const y = parseInt(timeValue, 10);
    if (isNaN(y) || y < bounds.minYear) return null;
    if (strictDataMin && y <= bounds.minYear) return null;
    return String(y - 1);
  }
  const val = timeValue || bounds.maxMonth;
  if (val <= minMonth) return null;
  const [y, m] = val.split('-').map(Number);
  if (isNaN(y) || isNaN(m)) return null;
  const date = new Date(y, m - 1, 1);
  date.setMonth(date.getMonth() - 1);
  let nval = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  if (nval < minMonth) return null;
  if (nval > bounds.maxMonth) nval = bounds.maxMonth;
  return nval;
}

function parsePeriodRows(raw: unknown): CommunityOpenRankRow[] {
  if (!Array.isArray(raw)) return [];
  const rows: CommunityOpenRankRow[] = [];
  for (const e of raw) {
    const r = parseOpenRankDetailTuple(e);
    if (r) rows.push(r);
  }
  return rows;
}

export function buildCommunityOpenRankDisplayRows(
  details: CommunityOpenRankDetailsFile,
  timeType: 'month' | 'year',
  timeValue: string,
  meta: LeaderboardMeta | null,
  dataBounds: TimeBounds | null = null,
): CommunityOpenRankDisplayRow[] {
  const curKey = communityOpenRankPeriodKey(timeType, timeValue);
  const curRaw = details[curKey];
  const rows = parsePeriodRows(curRaw).sort((a, b) => b.score - a.score);

  const prevKey = previousCommunityOpenRankPeriodKey(timeType, timeValue, meta, dataBounds);
  const prevRows = prevKey && details[prevKey] != null ? parsePeriodRows(details[prevKey]) : [];
  const sortedPrev = [...prevRows].sort((a, b) => b.score - a.score);
  const prevRankByKey = new Map<string, number>();
  const prevScoreByKey = new Map<string, number>();
  sortedPrev.forEach((r, i) => {
    const k = rowKey(r);
    prevRankByKey.set(k, i + 1);
    prevScoreByKey.set(k, r.score);
  });

  return rows.map((r, i) => {
    const k = rowKey(r);
    const curRank = i + 1;
    const prevRank = prevRankByKey.get(k);
    const prevScore = prevScoreByKey.get(k);
    return {
      ...r,
      rank: curRank,
      rankDelta: prevRank !== undefined ? prevRank - curRank : null,
      openrankDelta: prevScore !== undefined ? r.score - prevScore : null,
      avatarUrl: communityOpenRankAvatarUrl(r),
    };
  });
}
