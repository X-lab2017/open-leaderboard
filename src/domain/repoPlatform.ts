import { OPEN_DIGGER_PLATFORM_LOGO_BASE } from '../api/constants';

export function normalizeRepoPlatform(platform: unknown): string {
  if (platform == null || String(platform).trim() === '') return 'github';
  const raw = String(platform).trim();
  const lower = raw.toLowerCase().replace(/\/$/, '');
  if (lower.startsWith('http://') || lower.startsWith('https://')) {
    try {
      const u = new URL(lower);
      const h = u.hostname.replace(/^www\./, '');
      if (h === 'gitlab.com' || h.endsWith('.gitlab.com')) return 'gitlab';
      if (h === 'atomgit.com' || h.endsWith('.atomgit.com')) return 'atomgit';
      if (h === 'gitee.com') return 'gitee';
      if (h === 'github.com') return 'github';
    } catch {
      /* ignore */
    }
  }
  const slug = lower.replace(/\.com\/?$/, '').replace(/[^a-z0-9]+/g, '');
  if (slug === 'gitlab') return 'gitlab';
  if (slug === 'atomgit') return 'atomgit';
  if (slug === 'gitee') return 'gitee';
  if (slug === 'github') return 'github';
  if (lower.includes('gitlab')) return 'gitlab';
  if (lower.includes('atomgit')) return 'atomgit';
  if (lower.includes('gitee')) return 'gitee';
  const head = lower.replace(/\.com$/, '').split('/')[0];
  return head || 'github';
}

export function getRepoUrlByPlatform(platform: unknown, name: string): string {
  if (!name) return '#';
  const p = normalizeRepoPlatform(platform);
  if (p === 'gitlab') return `https://gitlab.com/${name}`;
  if (p === 'atomgit') return `https://atomgit.com/${name}`;
  if (p === 'gitee') return `https://gitee.com/${name}`;
  return `https://github.com/${name}`;
}

export function inferLabelAvatarUrl(labelIdFull: string | null | undefined): string {
  if (!labelIdFull || typeof labelIdFull !== 'string') return '';
  const path = labelIdFull.startsWith(':') ? labelIdFull.slice(1) : labelIdFull;
  if (!path) return '';
  return `${OPEN_DIGGER_PLATFORM_LOGO_BASE}${path}.png`;
}
