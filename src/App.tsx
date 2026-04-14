import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { fetchLeaderboardData, fetchLeaderboardMeta } from './api/openLeaderboard';
import { probeItemMetaExists } from './api/openDiggerTrend';
import { buildDataUrl, ITEMS_PER_PAGE } from './domain/leaderboard';
import { computeInitialTimeValue } from './domain/timeRange';
import { defaultScopeValue, defaultUnitValue, filterGroupTypesForUnitDropdown } from './domain/meta';
import { formatUpdateTime } from './domain/format';
import type { LeaderboardItem, LeaderboardMeta } from './types/api';
import { useI18n } from './i18n/I18nProvider';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { TitleBackground } from './components/hero/TitleBackground';
import { FilterPanel } from './components/filters/FilterPanel';
import { LeaderboardSection } from './components/leaderboard/LeaderboardSection';
import { PaginationControl } from './components/leaderboard/PaginationControl';
import { DetailOverlay } from './components/detail/DetailOverlay';
import { parseDashboardLeaderboardItem } from './domain/dashboardParam';

function ContentMessage({ type, message }: { type: 'error' | 'loading' | 'plain'; message: string }) {
  const boxClass = 'bg-dark-800 rounded-xl border border-dark-600';
  const padding = type === 'loading' ? 'p-8' : 'p-6';
  if (type === 'error') {
    return (
      <div className={`${boxClass} ${padding}`}>
        <div className="text-center text-red-400">
          <Icon icon="mdi:alert-circle" className="text-3xl mb-2" aria-hidden />
          <p>{message}</p>
        </div>
      </div>
    );
  }
  if (type === 'loading') {
    return (
      <div className={`${boxClass} ${padding}`}>
        <div className="text-center text-slate-400">
          <Icon icon="mdi:loading" className="text-3xl mb-2 animate-spin" aria-hidden />
          <p>{message}</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`${boxClass} ${padding}`}>
      <div className="text-center text-slate-400">
        <p>{message}</p>
      </div>
    </div>
  );
}

export default function App() {
  const { lang, t } = useI18n();
  const [meta, setMeta] = useState<LeaderboardMeta | null>(null);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [filtersReady, setFiltersReady] = useState(false);
  const [scopeValue, setScopeValue] = useState('');
  const [unitValue, setUnitValue] = useState('');
  const [timeType, setTimeType] = useState<'month' | 'year'>('month');
  const [timeValue, setTimeValue] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([]);
  const [boardLoading, setBoardLoading] = useState(false);
  const [boardError, setBoardError] = useState<string | null>(null);
  const [filterCollapsed, setFilterCollapsed] = useState(false);
  const [detailItem, setDetailItem] = useState<LeaderboardItem | null>(null);
  const leaderboardRowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchLeaderboardMeta()
      .then((m) => {
        if (cancelled) return;
        setMeta(m);
        const filteredUnits = filterGroupTypesForUnitDropdown(m.groupTypes);
        setScopeValue(defaultScopeValue(m.scopes, null));
        setUnitValue(defaultUnitValue(filteredUnits, null));
        setTimeValue(computeInitialTimeValue('month', m, ''));
        setFiltersReady(true);
        setMetaError(null);
      })
      .catch((e: Error) => {
        if (!cancelled) setMetaError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stub = parseDashboardLeaderboardItem(params.get('dashboard'));
    if (!stub?.itemType || (stub.itemType !== 'repo' && stub.itemType !== 'label')) return;
    const kind = stub.itemType;
    let cancelled = false;
    void probeItemMetaExists(kind, stub).then((ok) => {
      if (!cancelled && ok) setDetailItem(stub);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!filtersReady || !scopeValue || !unitValue || !timeValue) return;
    const url = buildDataUrl({ scopeName: scopeValue, groupTypeName: unitValue, timeType, timeValue });
    if (!url) return;
    let cancelled = false;
    setBoardLoading(true);
    setBoardError(null);
    void fetchLeaderboardData(url)
      .then((data) => {
        if (cancelled) return;
        setLeaderboardData(data);
        setCurrentPage(1);
        setBoardLoading(false);
      })
      .catch((e: Error) => {
        if (cancelled) return;
        setBoardError(e.message);
        setBoardLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filtersReady, scopeValue, unitValue, timeType, timeValue]);

  const filteredCount = leaderboardData.filter((item) => {
    if (!searchKeyword.trim()) return true;
    const k = searchKeyword.toLowerCase();
    return (
      (item.name || '').toLowerCase().includes(k) ||
      (item.name_zh || '').toLowerCase().includes(k) ||
      (item.id || '').toLowerCase().includes(k)
    );
  }).length;
  const totalPages = Math.ceil(filteredCount / ITEMS_PER_PAGE);

  const scrollToLeaderboardRows = useCallback(() => {
    const el = leaderboardRowsRef.current;
    if (!el) return;
    const headerHeight = 80;
    const dataTop = el.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: dataTop, behavior: 'smooth' });
  }, []);

  const handlePageChange = useCallback(
    (p: number) => {
      if (p < 1 || p > totalPages) return;
      setCurrentPage(p);
      requestAnimationFrame(scrollToLeaderboardRows);
    },
    [totalPages, scrollToLeaderboardRows],
  );

  const commitFilterChange = useCallback(() => {
    setSearchKeyword('');
    setCurrentPage(1);
  }, []);

  const updateTimeLabel = formatUpdateTime(meta?.updatedAt, lang);

  return (
    <>
      <Header />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
        <TitleBackground updateTimeLabel={updateTimeLabel} />
        <div className="flex gap-6">
          <FilterPanel
            meta={meta}
            scopeValue={scopeValue}
            unitValue={unitValue}
            timeType={timeType}
            timeValue={timeValue}
            searchKeyword={searchKeyword}
            onScopeChange={(v) => {
              setScopeValue(v);
              commitFilterChange();
            }}
            onUnitChange={(v) => {
              setUnitValue(v);
              commitFilterChange();
            }}
            onTimeTypeChange={setTimeType}
            onTimeValueChange={setTimeValue}
            onSearchChange={(v) => {
              setSearchKeyword(v);
              setCurrentPage(1);
            }}
            onSearchClear={() => {
              setSearchKeyword('');
              setCurrentPage(1);
            }}
            onTimeCommit={commitFilterChange}
            filterCollapsed={filterCollapsed}
            onToggleCollapse={() => setFilterCollapsed((c) => !c)}
            paginationSlot={
              <PaginationControl
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            }
          />
          {metaError ? (
            <div className="flex-1 min-w-0">
              <ContentMessage type="error" message={`${t('error')}: ${metaError}`} />
            </div>
          ) : !filtersReady ? (
            <div className="flex-1 min-w-0">
              <ContentMessage type="loading" message={t('loading')} />
            </div>
          ) : boardLoading ? (
            <div className="flex-1 min-w-0">
              <ContentMessage type="loading" message={t('loading')} />
            </div>
          ) : boardError ? (
            <div className="flex-1 min-w-0">
              <ContentMessage type="error" message={`${t('error')}: ${boardError}`} />
            </div>
          ) : (
            <LeaderboardSection
              ref={leaderboardRowsRef}
              meta={meta}
              data={leaderboardData}
              scopeName={scopeValue}
              unitName={unitValue}
              timeType={timeType}
              timeValue={timeValue}
              searchKeyword={searchKeyword}
              currentPage={currentPage}
              onRowClick={(row) => setDetailItem(row)}
            />
          )}
        </div>
      </div>
      <Footer />
      <DetailOverlay
        open={detailItem !== null}
        onClose={() => setDetailItem(null)}
        item={detailItem}
        unitName={unitValue}
        meta={meta}
        timeType={timeType}
        timeValue={timeValue}
      />
    </>
  );
}
