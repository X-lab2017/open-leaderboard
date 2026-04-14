import { DATA_BASE_URL } from '../api/constants';
import type { LeaderboardItem, MetaGroupType } from '../types/api';
import { isDivisionZeroTypeName } from './labelTypes';

export const ITEMS_PER_PAGE = 10;

/** True if the trimmed string's last code unit is an ASCII letter (for zh/CJK + Latin spacing). */
function endsWithAsciiLetter(s: string): boolean {
  const t = s.trim();
  if (!t) return false;
  const last = t[t.length - 1];
  return (last >= 'A' && last <= 'Z') || (last >= 'a' && last <= 'z');
}

/** Join scope + unit labels for Chinese leaderboard title when meta names end with Latin letters. */
export function joinZhLeaderboardScopeUnit(scopeLabel: string, unitLabel: string): string {
  const a = scopeLabel.trim();
  const b = unitLabel.trim();
  if (!a) return b;
  if (!b) return a;
  const needSpace = endsWithAsciiLetter(a) || endsWithAsciiLetter(b);
  return needSpace ? `${a} ${b}` : `${a}${b}`;
}

export function buildDataUrl(params: {
  scopeName: string;
  groupTypeName: string;
  timeType: 'month' | 'year';
  timeValue: string;
}): string | null {
  const { scopeName, groupTypeName, timeType, timeValue } = params;
  if (!scopeName || !groupTypeName || !timeValue) return null;
  const scopeLower = scopeName.toLowerCase();
  const groupTypeLower = groupTypeName.toLowerCase();
  let timePart = '';
  if (timeType === 'year') {
    timePart = `${timeType}/${timeValue}`;
  } else {
    const [year, month] = timeValue.split('-');
    const monthNoZero = parseInt(month, 10);
    timePart = `${timeType}/${year}${monthNoZero}`;
  }
  return `${DATA_BASE_URL}${scopeLower}/${groupTypeLower}/${timePart}/data.json`;
}

export function getFilteredLeaderboardData(data: LeaderboardItem[] | null | undefined, searchKeyword: string): LeaderboardItem[] {
  const list = data && Array.isArray(data) ? data : [];
  if (!searchKeyword) return list;
  const keywordLower = searchKeyword.toLowerCase();
  return list.filter((item) => {
    const name = (item.name || '').toLowerCase();
    const nameZh = (item.name_zh || '').toLowerCase();
    const id = (item.id || '').toLowerCase();
    return name.includes(keywordLower) || nameZh.includes(keywordLower) || id.includes(keywordLower);
  });
}

export function getItemTypeFromUnit(unitName: string): 'repo' | 'developer' | 'label' {
  const name = unitName.toLowerCase();
  if (name === 'repo') return 'repo';
  if (name === 'developer' || name === '开发者') return 'developer';
  return 'label';
}

export function getInitial(name: string | undefined): string {
  if (!name) return '?';
  if (/[\u4e00-\u9fa5]/.test(name)) return name.charAt(0);
  const match = name.match(/[a-zA-Z]/);
  return match ? match[0].toUpperCase() : name.charAt(0).toUpperCase();
}

export function getAvatarColor(name: string | undefined): string {
  if (!name) return '#6b7280';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 65%, 50%)`;
}

export function isDivisionLeaderboardUnit(groupTypeName: string, currentGroupType: MetaGroupType | undefined): boolean {
  return isDivisionZeroTypeName(groupTypeName) || isDivisionZeroTypeName(currentGroupType?.name);
}
