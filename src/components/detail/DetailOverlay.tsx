import { Icon } from '@iconify/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ContributionRow, LeaderboardItem, MetaLabelEntry, RepoTrendMap } from '../../types/api';
import { fetchItemMeta, fetchLabelTrendData, fetchRepoTrendData } from '../../api/openDiggerTrend';
import { enrichLabelItemWithMeta, getLabelDetailDescriptionFromMeta } from '../../domain/detailHelpers';
import { divisionLabelFlagAvatarUrl, preprocessContributions } from '../../domain/geography';
import { getItemTypeFromUnit } from '../../domain/leaderboard';
import { EMPTY_TREND } from '../../domain/trends';
import { isClickableDetailMetaLabelType, isDivisionZeroTypeName, LABEL_TYPE_MAP } from '../../domain/labelTypes';
import { getRepoUrlByPlatform, normalizeRepoPlatform } from '../../domain/repoPlatform';
import { LeaderboardAvatar } from '../leaderboard/LeaderboardAvatar';
import { TrendChart } from './TrendChart';
import { ContributionMap } from './ContributionMap';
import { RepoPlatformIcon } from './RepoPlatformIcon';
import { useI18n } from '../../i18n/I18nProvider';

type DetailViewState = {
  item: LeaderboardItem;
  trendData: RepoTrendMap | null;
  trendMode: 'month' | 'year';
  metaLabels: MetaLabelEntry[];
  metaRepos: Array<Record<string, unknown>>;
  metaLabelType: string | null;
  metaDesc: string | null;
  metaDescZh: string | null;
  contributions: ContributionRow[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  item: LeaderboardItem | null;
  unitName: string;
};

function getChangePct(latest: number, prev: number): string {
  if (!prev || prev === 0) return latest > 0 ? '100' : '0';
  return (((latest - prev) / prev) * 100).toFixed(1);
}

function getLatest(t: { values?: number[] } | null): number {
  const v = t?.values || [];
  return v.length ? Number(v[v.length - 1]) : 0;
}

function getPrev(t: { values?: number[] } | null): number {
  const v = t?.values || [];
  return v.length >= 2 ? Number(v[v.length - 2]) : 0;
}

export function DetailOverlay({ open, onClose, item, unitName }: Props) {
  const { lang, t } = useI18n();
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<DetailViewState | null>(null);
  const [navStack, setNavStack] = useState<DetailViewState[]>([]);

  const scrollBodyTop = () => {
    const el = bodyScrollRef.current;
    if (el) el.scrollTop = 0;
  };

  useEffect(() => {
    if (!open) {
      setNavStack([]);
      setView(null);
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !item) return;
    let cancelled = false;
    setNavStack([]);
    const itemType = (item.itemType || getItemTypeFromUnit(unitName)).toLowerCase();

    if (itemType === 'developer') {
      setLoading(false);
      setView({
        item: { ...item, itemType: 'developer' },
        trendData: null,
        trendMode: 'month',
        metaLabels: [],
        metaRepos: [],
        metaLabelType: null,
        metaDesc: null,
        metaDescZh: null,
        contributions: [],
      });
      return;
    }

    if (itemType === 'repo') {
      setLoading(true);
      setView(null);
      void (async () => {
        const platform = normalizeRepoPlatform(item.platform || 'github');
        const name = item.name || (lang === 'zh' ? item.name_zh : item.name) || '';
        let repoTrendData: RepoTrendMap | null = null;
        const itemMeta = await fetchItemMeta('repo', item);
        try {
          repoTrendData = await fetchRepoTrendData(platform, name);
        } catch {
          repoTrendData = {};
        }
        if (cancelled) return;
        setView({
          item,
          trendData: repoTrendData,
          trendMode: 'month',
          metaLabels: itemMeta.labels,
          metaRepos: [],
          metaLabelType: null,
          metaDesc: null,
          metaDescZh: null,
          contributions: itemMeta.contributions || [],
        });
        setLoading(false);
        scrollBodyTop();
      })();
      return () => {
        cancelled = true;
      };
    }

    if (itemType === 'label') {
      setLoading(true);
      setView(null);
      void (async () => {
        const labelId = (item.id || '').slice(1);
        let labelTrendData: RepoTrendMap | null = null;
        const itemMeta = await fetchItemMeta('label', item);
        try {
          labelTrendData = await fetchLabelTrendData(labelId);
        } catch {
          labelTrendData = {};
        }
        if (cancelled) return;
        const enrichedItem = enrichLabelItemWithMeta(item, itemMeta);
        setView({
          item: enrichedItem,
          trendData: labelTrendData,
          trendMode: 'month',
          metaLabels: itemMeta.labels,
          metaRepos: itemMeta.repos,
          metaLabelType: itemMeta.labelType,
          metaDesc: itemMeta.description,
          metaDescZh: itemMeta.descriptionZh,
          contributions: itemMeta.contributions || [],
        });
        setLoading(false);
        scrollBodyTop();
      })();
      return () => {
        cancelled = true;
      };
    }

    setView({
      item,
      trendData: null,
      trendMode: 'month',
      metaLabels: [],
      metaRepos: [],
      metaLabelType: null,
      metaDesc: null,
      metaDescZh: null,
      contributions: [],
    });
    setLoading(false);
    return;
  }, [open, item, unitName, lang]);

  const loadLabelWithPush = useCallback(
    (rawItem: LeaderboardItem, snapshot: DetailViewState) => {
      setNavStack((s) => [...s, snapshot]);
      setLoading(true);
      setView(null);
      void (async () => {
        const labelId = (rawItem.id || '').slice(1);
        let labelTrendData: RepoTrendMap | null = null;
        const itemMeta = await fetchItemMeta('label', rawItem);
        try {
          labelTrendData = await fetchLabelTrendData(labelId);
        } catch {
          labelTrendData = {};
        }
        const enrichedItem = enrichLabelItemWithMeta(rawItem, itemMeta);
        setView({
          item: enrichedItem,
          trendData: labelTrendData,
          trendMode: 'month',
          metaLabels: itemMeta.labels,
          metaRepos: itemMeta.repos,
          metaLabelType: itemMeta.labelType,
          metaDesc: itemMeta.description,
          metaDescZh: itemMeta.descriptionZh,
          contributions: itemMeta.contributions || [],
        });
        setLoading(false);
        scrollBodyTop();
      })();
    },
    [],
  );

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key !== 'Escape' || !open) return;
      onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const navigateToMetaLabel = (navItem: LeaderboardItem) => {
    if (!view) return;
    loadLabelWithPush({ ...navItem, itemType: 'label' }, view);
  };

  const goBack = () => {
    if (!navStack.length) return;
    const snap = navStack[navStack.length - 1];
    setNavStack((s) => s.slice(0, -1));
    setView(snap);
    scrollBodyTop();
  };

  const setTrendMode = (mode: 'month' | 'year') => {
    if (!view) return;
    setView({ ...view, trendMode: mode });
  };

  if (!open || !item) return null;

  const itemType = view ? (view.item.itemType || getItemTypeFromUnit(unitName)).toLowerCase() : '';
  const unitIsDivision = isDivisionZeroTypeName(unitName);

  const placeholderHeader = (it: LeaderboardItem, type: string) => {
    const displayName = lang === 'zh' ? (it.name_zh || it.name || '') : (it.name || '');
    let avatar = it.avatar || (type === 'repo' ? it.logo : '') || '';
    const itemDivision = isDivisionZeroTypeName(it.label_type) || isDivisionZeroTypeName(it.labelType);
    if (type === 'label' && (unitIsDivision || itemDivision)) {
      const flagUrl = divisionLabelFlagAvatarUrl(it);
      if (flagUrl) avatar = flagUrl;
    }
    const sizeClass = type === 'developer' ? 'w-20 h-20' : 'w-16 h-16';
    return (
      <div className="flex items-center gap-4">
        <div className={`flex-shrink-0 ${sizeClass} relative`}>
          <LeaderboardAvatar avatar={avatar} displayName={displayName} sizeClass={sizeClass} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-mono font-bold text-slate-100">
            {displayName || t('loading')}
          </h3>
        </div>
      </div>
    );
  };

  const developerHeader = (it: LeaderboardItem) => {
    const displayName = lang === 'zh' ? (it.name_zh || it.name || '') : (it.name || '');
    const profileUrl = it.url || it.html_url || `https://github.com/${it.id || it.name || ''}`;
    return (
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-20 h-20 relative">
          <LeaderboardAvatar avatar={it.avatar || ''} displayName={displayName} sizeClass="w-20 h-20" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-mono font-bold text-slate-100 mb-2">{displayName}</h3>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-dark-900 font-semibold text-sm transition-colors cursor-pointer"
          >
            <Icon icon="mdi:account-box-outline" />
            {t('detailDeveloperProfile')}
          </a>
        </div>
      </div>
    );
  };

  const developerBody = (it: LeaderboardItem) => {
    const projects = it.projects || [];
    return (
      <div className="flex flex-col gap-6">
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
          <TrendChart
            values={[]}
            label={t('detailDeveloperActivityChartLabel')}
            monthLabels={[]}
            noDataText={t('noData')}
          />
        </div>
        <div>
          <h4 className="text-sm font-mono font-semibold text-slate-300 mb-2">
            {t('detailHistoricalProjectsHeading')}
          </h4>
          <div className="space-y-2">
            {projects.length ? (
              projects.map((p, i) => {
                const row = typeof p === 'object' && p ? p : { name: String(p) };
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-2 px-3 bg-dark-700/40 rounded-lg border border-dark-600"
                  >
                    <span className="text-slate-500 w-8">{i + 1}</span>
                    <span className="flex-1 text-slate-200 font-medium">
                      {typeof row.name === 'string' ? row.name : String(p)}
                    </span>
                    <span className="text-slate-400 text-sm">
                      {t('detailRankPrefix')} #{row.rank != null ? row.rank : i + 1}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-500 text-sm py-4">{t('noData')}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderLabelRepoBody = (v: DetailViewState) => {
    const mode = v.trendMode;
    const it = v.item;
    const isRepo = itemType === 'repo';
    const isLabel = itemType === 'label';
    const displayName = lang === 'zh' ? (it.name_zh || it.name || '') : (it.name || '');
    const repoName = it.name || displayName || '';
    const dataKey = mode === 'year' ? 'yearly' : 'monthly';
    const td = v.trendData;
    const getTrend = (key: keyof NonNullable<RepoTrendMap>) =>
      td && td[key] && td[key]![dataKey]?.values?.length ? td[key]![dataKey] : null;
    const useReal = (isRepo || isLabel) && td && (getTrend('influence') || getTrend('activity'));
    const influenceTrend = useReal && getTrend('influence') ? getTrend('influence')! : EMPTY_TREND;
    const activityTrend = useReal && getTrend('activity') ? getTrend('activity')! : EMPTY_TREND;
    const devCountTrend = useReal && getTrend('participants') ? getTrend('participants')! : EMPTY_TREND;
    const issuePrTrend = useReal && getTrend('issuePr') ? getTrend('issuePr')! : EMPTY_TREND;

    const rawRepos = (it.repos || it.repositories || []) as unknown[];
    const rawReposNormalized = rawRepos.map((r) =>
      typeof r === 'object' && r ? (r as Record<string, unknown>) : { name: r, url: '#' },
    );
    const metaReposNormalized = v.metaRepos.length
      ? v.metaRepos.map((r) =>
          typeof r === 'object' ? { ...r, name: (r.name as string) || r } : { name: r, url: '#', platform: null },
        )
      : [];
    const repos = isLabel && metaReposNormalized.length ? metaReposNormalized : rawReposNormalized;

    const getRepoHref = (r: Record<string, unknown>) => {
      const p = r.platform || r.Platform;
      return p ? getRepoUrlByPlatform(p, String(r.name || '')) : String(r.url || '#');
    };

    const infLatest = getLatest(influenceTrend);
    const infPrev = getPrev(influenceTrend);
    const actLatest = getLatest(activityTrend);
    const actPrev = getPrev(activityTrend);
    const devLatest = getLatest(devCountTrend);
    const devPrev = getPrev(devCountTrend);
    const infPct = getChangePct(infLatest, infPrev);
    const actPct = getChangePct(actLatest, actPrev);
    const devPct = getChangePct(devLatest, devPrev);
    const timeKey =
      (influenceTrend?.months?.length ? influenceTrend.months[influenceTrend.months.length - 1] : '') || '';
    const contributionDetailRows = preprocessContributions(v.contributions);

    return (
      <div className="flex flex-col gap-6">
        {(isRepo || (isLabel && repos.length > 0)) && (
          <div className="w-full">
            {isRepo ? (
              <>
                <h4 className="text-sm font-mono font-semibold text-slate-300 mb-2">
                  {t('detailSectionRepoSingular')}
                </h4>
                <a
                  href={getRepoUrlByPlatform(it.platform, repoName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-700 border border-dark-600 text-slate-300 hover:border-accent/50 text-xs font-mono"
                >
                  <RepoPlatformIcon platform={it.platform} size="sm" />
                  <span className="truncate">{repoName}</span>
                </a>
              </>
            ) : (
              <>
                <h4 className="text-sm font-mono font-semibold text-slate-300 mb-2">
                  {t('detailSectionRepoList')}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {repos.map((r, idx) => {
                    const row = r as Record<string, unknown>;
                    const name = String(row.name || '');
                    const href = getRepoHref(row);
                    return (
                      <a
                        key={idx}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-dark-700 border border-dark-600 text-slate-300 hover:border-accent/50 text-[11px] font-mono leading-tight"
                      >
                        <RepoPlatformIcon platform={row.platform || row.Platform || 'github'} size="xs" />
                        <span className="truncate max-w-[8rem]">{name}</span>
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {(isRepo || isLabel) && (
          <div className="mb-2">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
              <h4 className="text-sm font-mono font-semibold text-slate-300">
                {t('detailBasicStatsHeading')}
              </h4>
              <div
                className="flex rounded-lg bg-dark-700 border border-dark-600 p-0.5"
                role="group"
                aria-label={t('detailTrendModeAria')}
              >
                <button
                  type="button"
                  id="detailPanelTrendMonth"
                  className={`detail-trend-toggle px-3 py-1.5 text-xs font-mono rounded-md text-slate-400 transition-colors ${mode === 'month' ? 'active' : ''}`}
                  onClick={() => setTrendMode('month')}
                >
                  {t('detailTrendModeMonth')}
                </button>
                <button
                  type="button"
                  id="detailPanelTrendYear"
                  className={`detail-trend-toggle px-3 py-1.5 text-xs font-mono rounded-md text-slate-400 transition-colors ${mode === 'year' ? 'active' : ''}`}
                  onClick={() => setTrendMode('year')}
                >
                  {t('detailTrendModeYear')}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon="mdi:lightning-bolt"
                iconBg="bg-purple-500/20"
                iconColor="text-purple-400"
                value={infLatest}
                pct={infPct}
                subtitle={`${t('detailStatOpenRankInfluence')}${timeKey ? ` (${timeKey})` : ''}`}
              />
              <StatCard
                icon="mdi:chart-line"
                iconBg="bg-emerald-500/20"
                iconColor="text-emerald-400"
                value={actLatest}
                pct={actPct}
                subtitle={`${t('detailStatActivity')}${timeKey ? ` (${timeKey})` : ''}`}
              />
              <StatCard
                icon="mdi:account-group"
                iconBg="bg-blue-500/20"
                iconColor="text-blue-400"
                value={devLatest}
                pct={devPct}
                subtitle={`${t('detailStatDeveloperCount')}${timeKey ? ` (${timeKey})` : ''}`}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-mono font-semibold text-slate-300">
            {t('detailHistoricalTrendHeading')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
              <TrendChart
                values={influenceTrend.values}
                label={t('detailChartInfluenceTrend')}
                monthLabels={influenceTrend.months}
                noDataText={t('noData')}
              />
            </div>
            <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
              <TrendChart
                values={activityTrend.values}
                label={t('detailChartActivityTrend')}
                monthLabels={activityTrend.months}
                noDataText={t('noData')}
              />
            </div>
            <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
              <TrendChart
                values={devCountTrend.values}
                label={t('detailChartParticipantsTrend')}
                monthLabels={devCountTrend.months}
                noDataText={t('noData')}
              />
            </div>
            <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
              <TrendChart
                values={issuePrTrend.values}
                label={t('detailChartIssuePrTrend')}
                monthLabels={issuePrTrend.months}
                noDataText={t('noData')}
              />
            </div>
          </div>
        </div>

        {isLabel && contributionDetailRows.length > 0 && (
          <div>
            <h4 className="text-sm font-mono font-semibold text-slate-300 mb-2">
              {t('detailContributionMapHeading')}
            </h4>
            <div className="flex gap-4">
              <div className="flex-shrink-0" style={{ width: '40%' }}>
                <div className="bg-dark-800 rounded-lg p-4 border border-dark-600" style={{ height: 320, overflowY: 'auto' }}>
                  <ContributionTable contributions={v.contributions} />
                </div>
              </div>
              <ContributionMap contributions={v.contributions} />
            </div>
          </div>
        )}
      </div>
    );
  };

  const headerContent = () => {
    const openingType = (item.itemType || getItemTypeFromUnit(unitName)).toLowerCase();
    if (loading || !view) {
      return placeholderHeader(item, openingType);
    }
    if (itemType === 'developer') {
      return developerHeader(view.item);
    }
    const it = view.item;
    const isRepo = itemType === 'repo';
    const isLabel = itemType === 'label';
    const displayName = lang === 'zh' ? (it.name_zh || it.name || '') : (it.name || '');
    let metaLabelType = view.metaLabelType;
    metaLabelType = it.label_type || metaLabelType;
    const metaLabelTypeMapKey = metaLabelType && isDivisionZeroTypeName(metaLabelType) ? 'Division-0' : metaLabelType;
    const labelTypeDesc =
      metaLabelTypeMapKey && LABEL_TYPE_MAP[metaLabelTypeMapKey]
        ? lang === 'zh'
          ? LABEL_TYPE_MAP[metaLabelTypeMapKey].zh
          : LABEL_TYPE_MAP[metaLabelTypeMapKey].en
        : metaLabelType || '';
    const badgeText = isRepo
      ? lang === 'zh'
        ? LABEL_TYPE_MAP.repo.zh
        : LABEL_TYPE_MAP.repo.en
      : isLabel && labelTypeDesc
        ? labelTypeDesc
        : '';
    const isDivisionLabel = isLabel && isDivisionZeroTypeName(metaLabelType);
    const detailHeaderAvatar =
      (isDivisionLabel ? divisionLabelFlagAvatarUrl(it) : '') || it.avatar || it.logo || '';
    const desc = isLabel
      ? getLabelDetailDescriptionFromMeta(lang === 'zh', view.metaDesc, view.metaDescZh, it)
      : lang !== 'zh'
        ? (it.desc_zh || it.description_zh || it.description || it.desc || '')
        : (it.description || it.desc || it.description_zh || it.desc_zh || '');

    const rawMetaLabels = view.metaLabels || [];

    return (
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-16 h-16 relative">
          <LeaderboardAvatar avatar={detailHeaderAvatar} displayName={displayName} sizeClass="w-16 h-16" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <h3 className="text-xl font-mono font-bold text-slate-100">{displayName}</h3>
            {badgeText ? (
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono leading-tight bg-accent/20 text-accent border border-accent/40">
                {badgeText}
              </span>
            ) : null}
            {(isRepo || isLabel) &&
              rawMetaLabels.map((l, idx) => {
                const text = lang === 'zh' ? (l.name_zh || l.name || '') : (l.name || l.name_zh || '');
                if (!text) return null;
                const metaType = l.type || null;
                const clickable = Boolean(l.id && metaType && isClickableDetailMetaLabelType(metaType));
                if (clickable) {
                  const navItem: LeaderboardItem = {
                    id: l.id || undefined,
                    name: l.name || '',
                    name_zh: l.name_zh || '',
                    itemType: 'label',
                    avatar: l.avatar || '',
                    label_type: metaType || undefined,
                  };
                  return (
                    <button
                      key={idx}
                      type="button"
                      className="inline-block px-2 py-0.5 rounded text-[11px] font-mono leading-tight bg-dark-600 text-slate-300 border border-dark-500 hover:border-accent/50 hover:text-accent transition-colors cursor-pointer align-baseline"
                      title={t('detailMetaLabelViewDetails')}
                      onClick={() => navigateToMetaLabel(navItem)}
                    >
                      {text}
                    </button>
                  );
                }
                return (
                  <span
                    key={idx}
                    className="inline-block px-2 py-0.5 rounded text-[11px] font-mono leading-tight bg-dark-600 text-slate-300 border border-dark-500"
                  >
                    {text}
                  </span>
                );
              })}
          </div>
          {desc ? <p className="text-slate-400 text-sm mb-2">{desc}</p> : null}
        </div>
      </div>
    );
  };

  const openingTypeForLoading = (item.itemType || getItemTypeFromUnit(unitName)).toLowerCase();
  const bodyContent = () => {
    if (loading || !view) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-slate-400">
          <Icon icon="mdi:loading" className="text-4xl animate-spin" aria-hidden />
          <p className="font-mono">
            {openingTypeForLoading === 'repo' ? t('loadingRepository') : t('loadingLabel')}
          </p>
        </div>
      );
    }
    if (itemType === 'developer') {
      return developerBody(view.item);
    }
    return renderLabelRepoBody(view);
  };

  return (
    <div
      id="detailPanelOverlay"
      className="detail-panel-overlay"
      aria-hidden={!open}
      onClick={(ev) => {
        if ((ev.target as HTMLElement).id === 'detailPanelOverlay') onClose();
      }}
    >
      <div className="detail-panel-content" onClick={(e) => e.stopPropagation()}>
        <div className="detail-panel-header">
          <div className="absolute top-4 right-4 z-10 flex flex-row-reverse items-center gap-2">
            <button
              type="button"
              id="detailPanelCloseBtn"
              title={t('closePanel')}
              aria-label={t('closePanel')}
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-dark-700 hover:bg-dark-600 border border-dark-600 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <Icon icon="mdi:close" className="text-xl" />
            </button>
            <button
              type="button"
              id="detailPanelBackBtn"
              title={t('detailBack')}
              aria-label={t('detailBack')}
              onClick={goBack}
              className={`w-9 h-9 flex items-center justify-center rounded-lg bg-dark-700 hover:bg-dark-600 border border-dark-600 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent ${navStack.length ? '' : 'hidden'}`}
            >
              <Icon icon="mdi:arrow-left" className="text-xl" />
            </button>
          </div>
          <div id="detailPanelHeaderContent">{headerContent()}</div>
        </div>
        <div ref={bodyScrollRef} className="detail-panel-body-scroll" id="detailPanelBody">
          {bodyContent()}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  iconBg,
  iconColor,
  value,
  pct,
  subtitle,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  value: number;
  pct: string;
  subtitle: string;
}) {
  const up = parseFloat(pct) >= 0;
  return (
    <div className="bg-dark-800 rounded-xl px-5 pt-5 pb-4 border border-dark-600 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 flex items-center justify-center flex-shrink-0 ${iconBg} rounded-lg`}>
            <Icon icon={icon} className={`w-5 h-5 ${iconColor}`} style={{ width: '1.25rem', height: '1.25rem' }} />
          </div>
          <div className="text-3xl font-bold text-slate-100">{value.toLocaleString()}</div>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
          <Icon icon={up ? 'mdi:trending-up' : 'mdi:trending-down'} className="w-4 h-4" />
          <span>{Math.abs(parseFloat(pct))}%</span>
        </div>
      </div>
      <div className="text-sm text-slate-400 mt-1">{subtitle}</div>
    </div>
  );
}

function ContributionTable({ contributions }: { contributions: ContributionRow[] }) {
  const { lang, t } = useI18n();
  const processed = preprocessContributions(contributions);
  const top10 = processed.slice().sort((a, b) => b.openrank - a.openrank).slice(0, 30);
  if (top10.length === 0) {
    return <p className="text-slate-500 text-sm py-4 text-center">{t('noData')}</p>;
  }
  const colName = t('contributionTableCountry');
  const colDevelopers = t('mapTooltipDevelopers');
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-dark-600 text-slate-400">
          <th className="text-left py-2 pr-3 font-mono">#</th>
          <th className="text-left py-2 pr-3 font-mono">{colName}</th>
          <th className="text-right py-2 pr-3 font-mono">{colDevelopers}</th>
          <th className="text-right py-2 font-mono">{t('headerOpenRank')}</th>
        </tr>
      </thead>
      <tbody>
        {top10.map((c, i) => {
          const countryDisplay = lang === 'zh' ? c.displayNameZh : c.displayNameEn;
          const flagHtml = c.countryCode ? (
            <img
              src={`https://flagcdn.com/24x18/${c.countryCode.toLowerCase()}.png`}
              alt=""
              className="inline-block align-middle mr-2"
              style={{ width: 24, height: 18 }}
            />
          ) : null;
          return (
            <tr key={i} className="border-b border-dark-600/50">
              <td className="py-2 pr-3 text-slate-500 font-mono">{i + 1}</td>
              <td className="py-2 pr-3 text-slate-200">
                {flagHtml}
                {countryDisplay}
              </td>
              <td className="py-2 pr-3 text-right font-mono text-slate-300">{(c.developers ?? 0).toLocaleString()}</td>
              <td className="py-2 text-right font-mono text-slate-300">{c.openrank.toLocaleString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
