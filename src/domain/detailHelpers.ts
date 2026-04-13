import type { ItemMetaResult, LeaderboardItem } from '../types/api';
import { inferLabelAvatarUrl } from './repoPlatform';

export function enrichLabelItemWithMeta(item: LeaderboardItem, itemMeta: ItemMetaResult): LeaderboardItem {
  const base = item && typeof item === 'object' ? item : {};
  const inferred = inferLabelAvatarUrl(base.id);
  return {
    ...base,
    itemType: 'label',
    avatar: base.avatar || base.logo || itemMeta.metaAvatar || inferred || '',
    name: base.name || itemMeta.metaName || '',
    name_zh: base.name_zh || itemMeta.metaNameZh || '',
    description: base.description || itemMeta.description || '',
    description_zh: base.description_zh || itemMeta.descriptionZh || '',
  };
}

export function getLabelDetailDescriptionFromMeta(
  langZh: boolean,
  metaDesc: string | null | undefined,
  metaDescZh: string | null | undefined,
  item: LeaderboardItem,
): string {
  const raw = langZh ? metaDescZh : metaDesc;
  if (raw != null && String(raw).trim() !== '') return String(raw).trim();
  const nameFallback = !langZh ? (item.name_zh || item.name || '') : (item.name || item.name_zh || '');
  return String(nameFallback || '').trim();
}
