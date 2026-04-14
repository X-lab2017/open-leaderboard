import { TREND_DATA_BASE } from './constants';
import type { CommunityOpenRankDetailsFile } from '../domain/communityOpenRankDetails';

export async function fetchCommunityOpenRankDetails(labelId: string): Promise<CommunityOpenRankDetailsFile | null> {
  if (!labelId) return null;
  try {
    const res = await fetch(`${TREND_DATA_BASE}${labelId}/community_openrank_details.json`);
    if (!res.ok) return null;
    const json: unknown = await res.json();
    if (!json || typeof json !== 'object' || Array.isArray(json)) return null;
    const keys = Object.keys(json as object);
    if (keys.length === 0) return null;
    return json as CommunityOpenRankDetailsFile;
  } catch {
    return null;
  }
}
