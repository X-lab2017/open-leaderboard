import { TREND_DATA_BASE } from './constants';
import type { ItemMetaResult, LeaderboardItem, RepoTrendMap, TrendJson, UserOssMeta } from '../types/api';
import {
  EMPTY_TREND_PAIR,
  getTrendDataFromJson,
  getTrendDataFromJsonYearly,
} from '../domain/trends';
import { normalizeRepoPlatform } from '../domain/repoPlatform';

async function fetchTrendDataByUrls(urls: Record<string, string>): Promise<RepoTrendMap> {
  const result: RepoTrendMap = {};
  await Promise.all(
    Object.entries(urls).map(async ([key, url]) => {
      try {
        const res = await fetch(url);
        const data = res.ok ? ((await res.json()) as TrendJson) : null;
        result[key as keyof RepoTrendMap] = data
          ? { monthly: getTrendDataFromJson(data), yearly: getTrendDataFromJsonYearly(data) }
          : EMPTY_TREND_PAIR;
      } catch {
        result[key as keyof RepoTrendMap] = EMPTY_TREND_PAIR;
      }
    }),
  );
  return result;
}

export async function fetchRepoTrendData(platform: unknown, name: string): Promise<RepoTrendMap | null> {
  if (!name) return null;
  const p = normalizeRepoPlatform(platform || 'github');
  const base = `${TREND_DATA_BASE}${p}/${name}/`;
  return fetchTrendDataByUrls({
    influence: base + 'openrank.json',
    activity: base + 'activity.json',
    participants: base + 'participants.json',
    issuePr: base + 'issues_and_change_request_active.json',
  });
}

export async function fetchLabelTrendData(labelId: string): Promise<RepoTrendMap | null> {
  if (!labelId) return null;
  const base = `${TREND_DATA_BASE}${labelId}/`;
  return fetchTrendDataByUrls({
    influence: base + 'openrank.json',
    activity: base + 'activity.json',
    participants: base + 'participants.json',
    issuePr: base + 'issues_and_change_request_active.json',
  });
}

/** User directory on OSS: openrank/activity plus issue & PR activity JSONs. */
export async function fetchUserTrendData(platform: unknown, login: string): Promise<RepoTrendMap | null> {
  const handle = (login || '').split('/')[0]?.trim() || '';
  if (!handle) return null;
  const p = normalizeRepoPlatform(platform || 'github');
  const base = `${TREND_DATA_BASE}${p}/${handle}/`;
  return fetchTrendDataByUrls({
    influence: base + 'openrank.json',
    activity: base + 'activity.json',
    openIssue: base + 'open_issue.json',
    issueComment: base + 'issue_comment.json',
    openPull: base + 'open_pull.json',
    reviewComment: base + 'review_comment.json',
  });
}

function parseUserInfo(raw: unknown): UserOssMeta['info'] {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const str = (k: string) => {
    const v = o[k];
    return typeof v === 'string' ? v : v != null ? String(v) : '';
  };
  const name = str('name').trim();
  const bio = str('bio').trim();
  const company = str('company').trim();
  const location = str('location').trim();
  if (!name && !bio && !company && !location) return null;
  return { name: name || undefined, bio: bio || undefined, company: company || undefined, location: location || undefined };
}

/** Returns null if meta.json is missing or invalid. */
export async function fetchUserMeta(platform: unknown, login: string): Promise<UserOssMeta | null> {
  const handle = (login || '').split('/')[0]?.trim() || '';
  if (!handle) return null;
  const p = normalizeRepoPlatform(platform || 'github');
  const url = `${TREND_DATA_BASE}${p}/${handle}/meta.json`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const meta = (await res.json()) as Record<string, unknown>;
    const idRaw = meta.id;
    const id =
      typeof idRaw === 'number'
        ? String(idRaw)
        : typeof idRaw === 'string'
          ? idRaw
          : undefined;
    const info = parseUserInfo(meta.info);
    return { id, info };
  } catch {
    return null;
  }
}

const emptyMeta = (): ItemMetaResult => ({
  labels: [],
  repos: [],
  labelType: null,
  description: null,
  descriptionZh: null,
  contributions: [],
  metaAvatar: null,
  metaName: null,
  metaNameZh: null,
});

function buildItemMetaUrl(itemType: 'repo' | 'label', item: LeaderboardItem | null): string | null {
  if (!item) return null;
  if (itemType === 'repo') {
    const p = normalizeRepoPlatform(item.platform || 'github');
    const name = item.name || item.name_zh || '';
    if (!name) return null;
    return `${TREND_DATA_BASE}${p}/${name}/meta.json`;
  }
  if (itemType === 'label') {
    const labelId = (item.id || '').slice(1);
    if (!labelId) return null;
    return `${TREND_DATA_BASE}${labelId}/meta.json`;
  }
  return null;
}

export async function probeItemMetaExists(itemType: 'repo' | 'label', item: LeaderboardItem): Promise<boolean> {
  const metaUrl = buildItemMetaUrl(itemType, item);
  if (!metaUrl) return false;
  try {
    const res = await fetch(metaUrl);
    return res.ok;
  } catch {
    return false;
  }
}

/** 与 fetchUserMeta 同源路径：用于 ?dashboard= 深链打开前探测开发者是否存在。 */
export async function probeUserMetaExists(item: LeaderboardItem): Promise<boolean> {
  const handle = ((item.login ?? item.name) || '').split('/')[0]?.trim() || '';
  if (!handle) return false;
  const p = normalizeRepoPlatform(item.platform || 'github');
  const url = `${TREND_DATA_BASE}${p}/${handle}/meta.json`;
  try {
    const res = await fetch(url);
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchItemMeta(itemType: 'repo' | 'label', item: LeaderboardItem | null): Promise<ItemMetaResult> {
  if (!item) return { ...emptyMeta() };
  const metaUrl = buildItemMetaUrl(itemType, item);
  if (!metaUrl) return { ...emptyMeta() };
  try {
    const res = await fetch(metaUrl);
    const meta = res.ok ? ((await res.json()) as Record<string, unknown>) : null;
    const rawLabels = meta && Array.isArray(meta.labels) ? meta.labels : [];
    const labels = rawLabels.map((l: Record<string, unknown>) => {
      if (!l || typeof l !== 'object') return { name: '', name_zh: '', id: null, type: null, avatar: null };
      return {
        name: (l.name as string) ?? '',
        name_zh: (l.name_zh as string) ?? '',
        id: (l.id as string) ?? null,
        type: (l.type as string) ?? (l.label_type as string) ?? null,
        avatar: (l.avatar as string) ?? null,
      };
    });
    const rawRepos = itemType === 'label' && meta && Array.isArray(meta.repos) ? meta.repos : [];
    const repos = rawRepos.filter((r) => r != null) as Array<Record<string, unknown>>;
    const labelType = itemType === 'label' && meta ? ((meta.label_type as string) ?? null) : null;
    const description = itemType === 'label' && meta ? ((meta.description as string) ?? null) : null;
    const descriptionZh = itemType === 'label' && meta ? ((meta.description_zh as string) ?? null) : null;
    const contributions = meta && Array.isArray(meta.contributions) ? (meta.contributions as ItemMetaResult['contributions']) : [];
    const metaAvatar = itemType === 'label' && meta ? ((meta.avatar as string) ?? (meta.logo as string) ?? null) : null;
    const metaName = itemType === 'label' && meta ? ((meta.name as string) ?? null) : null;
    const metaNameZh = itemType === 'label' && meta ? ((meta.name_zh as string) ?? null) : null;
    return { labels, repos, labelType, description, descriptionZh, contributions, metaAvatar, metaName, metaNameZh };
  } catch {
    return { ...emptyMeta() };
  }
}
