export const LABEL_TYPE_MAP: Record<string, { en: string; zh: string }> = {
  repo: { en: 'Repo', zh: '仓库' },
  Project: { en: 'Project', zh: '项目' },
  Company: { en: 'Company', zh: '公司' },
  'University-0': { en: 'University', zh: '学校' },
  'Institution-0': { en: 'Institution', zh: '研究机构' },
  Foundation: { en: 'Foundation', zh: '基金会' },
  'Agency-0': { en: 'Agency', zh: '政府机构' },
  'Tech-0': { en: 'Tech', zh: '技术领域' },
  'Division-0': { en: 'Country', zh: '国家' },
};

export const CLICKABLE_DETAIL_META_LABEL_TYPES = new Set([
  'Company',
  'Project',
  'Foundation',
  'University-0',
  'Institution-0',
  'Agency-0',
  'Tech-0',
  'Division-0',
]);

export function isDivisionZeroTypeName(v: unknown): boolean {
  return typeof v === 'string' && v.trim().toLowerCase() === 'division-0';
}

export function isClickableDetailMetaLabelType(t: string | null | undefined): boolean {
  if (!t || typeof t !== 'string') return false;
  if (isDivisionZeroTypeName(t)) return true;
  return CLICKABLE_DETAIL_META_LABEL_TYPES.has(t);
}
