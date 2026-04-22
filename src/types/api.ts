export type Lang = 'zh' | 'en';

export interface MetaScope {
  name?: string;
  name_zh?: string;
}

export interface MetaGroupType {
  name?: string;
  name_zh?: string;
}

export interface LeaderboardMeta {
  updatedAt?: string | null;
  scopes: MetaScope[];
  groupTypes: MetaGroupType[];
}

export interface LeaderboardItem {
  id?: string;
  /** OSS user path segment; falls back to name for developer rows. */
  login?: string;
  name?: string;
  name_zh?: string;
  description?: string;
  description_zh?: string;
  desc?: string;
  desc_zh?: string;
  avatar?: string;
  logo?: string;
  openrank?: number;
  openrankDelta?: number | null;
  participants?: number;
  participantsDelta?: number | null;
  rankDelta?: number | null;
  platform?: string;
  Platform?: string;
  itemType?: string;
  label_type?: string;
  labelType?: string;
  url?: string;
  html_url?: string;
  projects?: Array<{ name?: string; rank?: number } | string>;
  repos?: unknown[];
  repositories?: unknown[];
  contributors?: unknown[];
}

/** Parsed fields from https://oss.open-digger.cn/{platform}/{login}/meta.json for type user. */
export interface UserOssMeta {
  id?: string;
  info: {
    name?: string;
    bio?: string;
    company?: string;
    location?: string;
  } | null;
}

export interface LeaderboardDataFile {
  data?: LeaderboardItem[];
}

/** OpenDigger trend / activity JSON: keys are YYYY-MM or YYYY */
export type TrendJson = Record<string, number | { value?: number; openrank?: number } | null | undefined>;

export interface TrendSeries {
  months: string[];
  values: number[];
}

export interface TrendDataBundle {
  monthly: TrendSeries;
  yearly: TrendSeries;
}

export type RepoTrendKey =
  | 'influence'
  | 'activity'
  | 'participants'
  | 'issuePr'
  | 'openIssue'
  | 'issueComment'
  | 'openPull'
  | 'reviewComment';

export type RepoTrendMap = Partial<Record<RepoTrendKey, TrendDataBundle>>;

export interface MetaLabelEntry {
  name?: string;
  name_zh?: string;
  id?: string | null;
  type?: string | null;
  label_type?: string | null;
  avatar?: string | null;
}

export interface ContributionRow {
  country?: string;
  country_zh?: string;
  countryZh?: string;
  openrank?: number;
  developers?: number;
}

export interface ItemMetaResult {
  labels: MetaLabelEntry[];
  repos: Array<Record<string, unknown>>;
  labelType: string | null;
  description: string | null;
  descriptionZh: string | null;
  contributions: ContributionRow[];
  metaAvatar: string | null;
  metaName: string | null;
  metaNameZh: string | null;
}

export interface ProcessedContribution {
  mapName: string;
  displayNameZh: string;
  displayNameEn: string;
  openrank: number;
  developers: number;
  countryCode: string | null;
}
