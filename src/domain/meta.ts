import type { LeaderboardMeta } from '../types/api';
import { isDivisionZeroTypeName } from './labelTypes';

export function normalizeLeaderboardMeta(raw: unknown): LeaderboardMeta {
  const r = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  return {
    updatedAt: (r.updatedAt as string | null | undefined) ?? null,
    scopes: Array.isArray(r.scopes) ? (r.scopes as LeaderboardMeta['scopes']) : [],
    groupTypes: Array.isArray(r.groupTypes) ? (r.groupTypes as LeaderboardMeta['groupTypes']) : [],
  };
}

export function filterGroupTypesForUnitDropdown(groupTypes: LeaderboardMeta['groupTypes']) {
  return groupTypes.filter((g) => {
    if (!g || typeof g !== 'object') return false;
    if (isDivisionZeroTypeName(g.name)) return true;
    const name = (g.name ?? g.name_zh ?? '').toLowerCase();
    const nameZh = g.name_zh ?? '';
    return !(name.includes('country') || nameZh.includes('国家') || nameZh.includes('地区'));
  });
}

export function defaultScopeValue(scopes: LeaderboardMeta['scopes'], saved: string | null): string {
  const ok =
    saved && scopes.some((s) => s && (s.name === saved || s.name_zh === saved)) ? saved : null;
  if (ok) return ok;
  const globalScope = scopes.find((s) => s && s.name === 'Global');
  return globalScope?.name ?? globalScope?.name_zh ?? scopes[0]?.name ?? scopes[0]?.name_zh ?? '';
}

export function defaultUnitValue(filtered: LeaderboardMeta['groupTypes'], saved: string | null): string {
  const ok =
    saved && filtered.some((g) => g && (g.name === saved || g.name_zh === saved)) ? saved : null;
  if (ok) return ok;
  const project = filtered.find((g) => g && g.name === 'Project');
  return project?.name ?? project?.name_zh ?? filtered[0]?.name ?? filtered[0]?.name_zh ?? '';
}
