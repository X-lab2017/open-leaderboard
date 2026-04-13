import { DATA_BASE_URL } from './constants';
import { normalizeLeaderboardMeta } from '../domain/meta';
import type { LeaderboardDataFile, LeaderboardItem, LeaderboardMeta } from '../types/api';

export async function fetchLeaderboardMeta(): Promise<LeaderboardMeta> {
  const response = await fetch(`${DATA_BASE_URL}meta.json`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const raw = await response.json();
  return normalizeLeaderboardMeta(raw);
}

export async function fetchLeaderboardData(dataUrl: string): Promise<LeaderboardItem[]> {
  const response = await fetch(dataUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const json = (await response.json()) as LeaderboardDataFile;
  return json.data || [];
}
