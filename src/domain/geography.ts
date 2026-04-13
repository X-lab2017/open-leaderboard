import type { ContributionRow, LeaderboardItem, ProcessedContribution } from '../types/api';
import { isDivisionZeroTypeName } from './labelTypes';

export const COUNTRY_TO_ISO: Record<string, string> = {
  'United States': 'US',
  'United States of America': 'US',
  USA: 'US',
  America: 'US',
  China: 'CN',
  Chinese: 'CN',
  Russia: 'RU',
  'Russian Federation': 'RU',
  'United Kingdom': 'GB',
  UK: 'GB',
  'United Kingdom of Great Britain and Northern Ireland': 'GB',
  Britain: 'GB',
  England: 'GB',
  Germany: 'DE',
  Deutschland: 'DE',
  France: 'FR',
  India: 'IN',
  Japan: 'JP',
  Korea: 'KR',
  'South Korea': 'KR',
  'Korea, Republic of': 'KR',
  'Republic of Korea': 'KR',
  'Dem. Rep. Korea': 'KP',
  'North Korea': 'KP',
  "Korea, Democratic People's Republic of": 'KP',
  Brazil: 'BR',
  Canada: 'CA',
  Australia: 'AU',
  Netherlands: 'NL',
  'Netherlands, Kingdom of the': 'NL',
  Holland: 'NL',
  Italy: 'IT',
  Spain: 'ES',
  Ukraine: 'UA',
  Poland: 'PL',
  Indonesia: 'ID',
  Mexico: 'MX',
  Turkey: 'TR',
  Türkiye: 'TR',
  Vietnam: 'VN',
  'Viet Nam': 'VN',
  Pakistan: 'PK',
  Bangladesh: 'BD',
  Philippines: 'PH',
  Egypt: 'EG',
  Iran: 'IR',
  'Iran, Islamic Republic of': 'IR',
  Thailand: 'TH',
  'South Africa': 'ZA',
  Nigeria: 'NG',
  Malaysia: 'MY',
  Singapore: 'SG',
  Belgium: 'BE',
  Sweden: 'SE',
  Switzerland: 'CH',
  Austria: 'AT',
  Israel: 'IL',
  Argentina: 'AR',
  Romania: 'RO',
  'Czech Rep.': 'CZ',
  'Czech Republic': 'CZ',
  Czechia: 'CZ',
  Portugal: 'PT',
  Hungary: 'HU',
  Greece: 'GR',
  Colombia: 'CO',
  Chile: 'CL',
  Kenya: 'KE',
  Ireland: 'IE',
  'New Zealand': 'NZ',
  Denmark: 'DK',
  Norway: 'NO',
  Finland: 'FI',
  Belarus: 'BY',
  Kazakhstan: 'KZ',
  Bulgaria: 'BG',
  Croatia: 'HR',
  Serbia: 'RS',
  Slovakia: 'SK',
  Lithuania: 'LT',
  Estonia: 'EE',
  Latvia: 'LV',
  Slovenia: 'SI',
  Bolivia: 'BO',
  'Bolivia, Plurinational State of': 'BO',
  Venezuela: 'VE',
  'Venezuela, Bolivarian Republic of': 'VE',
  'Dominican Rep.': 'DO',
  'Dominican Republic': 'DO',
  'Dem. Rep. Congo': 'CD',
  'Congo, Democratic Republic of the': 'CD',
  'DR Congo': 'CD',
  Tanzania: 'TZ',
  'Tanzania, United Republic of': 'TZ',
  'Lao PDR': 'LA',
  "Lao People's Democratic Republic": 'LA',
  Laos: 'LA',
  'S. Sudan': 'SS',
  'South Sudan': 'SS',
  'Central African Rep.': 'CF',
  'Central African Republic': 'CF',
  'Hong Kong': 'HK',
  'Hong Kong SAR': 'HK',
  Taiwan: 'TW',
  'Saudi Arabia': 'SA',
  'United Arab Emirates': 'AE',
  UAE: 'AE',
  Algeria: 'DZ',
  Armenia: 'AM',
  Azerbaijan: 'AZ',
  Georgia: 'GE',
  Iraq: 'IQ',
  Jordan: 'JO',
  Lebanon: 'LB',
  Morocco: 'MA',
  Palestine: 'PS',
  Qatar: 'QA',
  Tunisia: 'TN',
  Yemen: 'YE',
  Afghanistan: 'AF',
  Nepal: 'NP',
  'Sri Lanka': 'LK',
  Uzbekistan: 'UZ',
  Ecuador: 'EC',
  Peru: 'PE',
  'Costa Rica': 'CR',
  Cuba: 'CU',
  Guatemala: 'GT',
  Panama: 'PA',
  'Puerto Rico': 'PR',
  Uruguay: 'UY',
  Ethiopia: 'ET',
  Ghana: 'GH',
  Uganda: 'UG',
  Zimbabwe: 'ZW',
  Cambodia: 'KH',
  Myanmar: 'MM',
  Mongolia: 'MN',
};

export const COUNTRY_NAME_MAP: Record<string, string> = {
  'United States of America': 'United States',
  'Russian Federation': 'Russia',
  'United Kingdom of Great Britain and Northern Ireland': 'United Kingdom',
  Czechia: 'Czech Rep.',
  'Netherlands, Kingdom of the': 'Netherlands',
  'Korea, Republic of': 'Korea',
  Türkiye: 'Turkey',
  'Viet Nam': 'Vietnam',
  'Iran, Islamic Republic of': 'Iran',
  'Bolivia, Plurinational State of': 'Bolivia',
  'Venezuela, Bolivarian Republic of': 'Venezuela',
  'Dominican Republic': 'Dominican Rep.',
  'Congo, Democratic Republic of the': 'Dem. Rep. Congo',
  'Tanzania, United Republic of': 'Tanzania',
  "Lao People's Democratic Republic": 'Lao PDR',
  "Korea, Democratic People's Republic of": 'Dem. Rep. Korea',
  'South Sudan': 'S. Sudan',
  'Central African Republic': 'Central African Rep.',
};

export function getCountryFlagCode(name: string | null | undefined): string | null {
  if (!name || typeof name !== 'string') return null;
  const trimmed = name.trim();
  return COUNTRY_TO_ISO[trimmed] || COUNTRY_TO_ISO[trimmed.replace(/\s+/g, ' ')] || null;
}

export function getDivisionLabelFlagCodeFromItem(item: LeaderboardItem | null | undefined): string | null {
  if (!item || typeof item !== 'object') return null;
  const raw = (item.name || '').trim();
  if (!raw) return null;
  const normalized = COUNTRY_NAME_MAP[raw] || raw;
  return getCountryFlagCode(normalized) || getCountryFlagCode(raw);
}

export function divisionLabelFlagAvatarUrl(item: LeaderboardItem | null | undefined): string {
  const code = getDivisionLabelFlagCodeFromItem(item);
  if (!code) return '';
  const iso = String(code).trim().toLowerCase();
  return iso ? `https://flagcdn.com/w80/${iso}.png` : '';
}

export function preprocessContributions(contributions: ContributionRow[] | null | undefined): ProcessedContribution[] {
  if (!contributions || !Array.isArray(contributions)) return [];
  return contributions.map((c) => {
    const mapName = COUNTRY_NAME_MAP[c.country || ''] || c.country || '';
    const zh = c.country_zh ?? c.countryZh;
    const displayNameZh = zh != null && String(zh).trim() ? String(zh).trim() : mapName;
    const displayNameEn = mapName;
    const openrank = typeof c.openrank === 'number' && !Number.isNaN(c.openrank) ? c.openrank : 0;
    const developers = typeof c.developers === 'number' && !Number.isNaN(c.developers) ? c.developers : 0;
    const countryCode = getCountryFlagCode(mapName) || getCountryFlagCode(c.country);
    return { mapName, displayNameZh, displayNameEn, openrank, developers, countryCode };
  });
}

export function leaderboardAvatarForItem(
  item: LeaderboardItem,
  unitGroupTypeName: string,
  currentGroupTypeObj: { name?: string } | undefined,
): string {
  const isDivisionLeaderboardUnit =
    isDivisionZeroTypeName(unitGroupTypeName) || isDivisionZeroTypeName(currentGroupTypeObj?.name);
  const flagUrl = isDivisionLeaderboardUnit ? divisionLabelFlagAvatarUrl(item) : '';
  return flagUrl || item.avatar || '';
}
