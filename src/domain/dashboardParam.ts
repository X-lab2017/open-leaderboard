import type { LeaderboardItem } from '../types/api';
import { normalizeRepoPlatform } from './repoPlatform';

const KNOWN_PLATFORMS = new Set(['github', 'gitlab', 'gitee', 'atomgit']);

function decodeParam(raw: string): string {
  const t = raw.trim();
  try {
    return decodeURIComponent(t);
  } catch {
    return t;
  }
}

/**
 * 解析 ?dashboard= 参数：标签须以 `:` 开头且后面有非空 id；
 * 开发者为 platform/login（两段）；
 * 仓库须为 platform/owner/repo（三段及以上），且 platform 归一化后为已知平台。
 */
export function parseDashboardLeaderboardItem(paramValue: string | null): LeaderboardItem | null {
  if (paramValue == null) return null;
  const v = decodeParam(paramValue);
  if (!v) return null;

  if (v.startsWith(':')) {
    const rest = v.slice(1).trim();
    if (!rest) return null;
    return { id: v, itemType: 'label' };
  }

  const parts = v.split('/').map((s) => s.trim()).filter((s) => s.length > 0);
  if (parts.length < 2) return null;

  const platform = normalizeRepoPlatform(parts[0]);
  if (!KNOWN_PLATFORMS.has(platform)) return null;

  if (parts.length === 2) {
    const login = parts[1];
    if (!login) return null;
    return { platform, login, name: login, itemType: 'developer' };
  }

  const name = parts.slice(1).join('/');
  if (!name) return null;
  return { name, platform, itemType: 'repo' };
}
