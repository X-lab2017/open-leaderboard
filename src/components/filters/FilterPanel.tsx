import { Icon } from '@iconify/react/offline';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import type { LeaderboardMeta } from '../../types/api';
import { filterGroupTypesForUnitDropdown } from '../../domain/meta';
import { TimeRangePicker } from './TimeRangePicker';
import { useI18n } from '../../i18n/I18nProvider';
import { computeInitialTimeValue } from '../../domain/timeRange';

type Props = {
  meta: LeaderboardMeta | null;
  scopeValue: string;
  unitValue: string;
  timeType: 'month' | 'year';
  timeValue: string;
  searchKeyword: string;
  onScopeChange: (v: string) => void;
  onUnitChange: (v: string) => void;
  onTimeTypeChange: (v: 'month' | 'year') => void;
  onTimeValueChange: (v: string) => void;
  onSearchChange: (v: string) => void;
  onSearchClear: () => void;
  onTimeCommit: () => void;
  filterCollapsed: boolean;
  onToggleCollapse: () => void;
  paginationSlot: ReactNode;
};

function preventFilterDropdownScrollChaining(e: React.WheelEvent<HTMLDivElement>) {
  const menu = e.currentTarget;
  if (!menu.classList.contains('show')) return;
  const { scrollTop, clientHeight, scrollHeight } = menu;
  const atTop = scrollTop <= 0;
  const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
  if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
    e.preventDefault();
  }
}

export function FilterPanel({
  meta,
  scopeValue,
  unitValue,
  timeType,
  timeValue,
  searchKeyword,
  onScopeChange,
  onUnitChange,
  onTimeTypeChange,
  onTimeValueChange,
  onSearchChange,
  onSearchClear,
  onTimeCommit,
  filterCollapsed,
  onToggleCollapse,
  paginationSlot,
}: Props) {
  const { lang, t } = useI18n();
  const [scopeMenuOpen, setScopeMenuOpen] = useState(false);
  const [unitMenuOpen, setUnitMenuOpen] = useState(false);

  const anyFilterOpen = scopeMenuOpen || unitMenuOpen;
  useEffect(() => {
    if (anyFilterOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
    };
  }, [anyFilterOpen]);

  const closeOnOutside = useCallback((e: MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest('#scopeDropdownWrap') || t.closest('#unitDropdownWrap')) return;
    setScopeMenuOpen(false);
    setUnitMenuOpen(false);
  }, []);

  useEffect(() => {
    if (scopeMenuOpen || unitMenuOpen) {
      setTimeout(() => document.addEventListener('click', closeOnOutside), 0);
    } else {
      document.removeEventListener('click', closeOnOutside);
    }
    return () => document.removeEventListener('click', closeOnOutside);
  }, [scopeMenuOpen, unitMenuOpen, closeOnOutside]);

  const scopes = meta?.scopes ?? [];
  const filteredUnits = meta ? filterGroupTypesForUnitDropdown(meta.groupTypes) : [];

  const scopeLabel = (() => {
    const s = scopes.find((x) => x && (x.name === scopeValue || x.name_zh === scopeValue));
    if (!s) return scopeValue || t('loading');
    return lang === 'zh' ? (s.name_zh ?? s.name ?? '') : (s.name ?? s.name_zh ?? '');
  })();

  const unitLabel = (() => {
    const g = filteredUnits.find((x) => x && (x.name === unitValue || x.name_zh === unitValue));
    if (!g) return unitValue || t('loading');
    return lang === 'zh' ? (g.name_zh ?? g.name ?? '') : (g.name ?? g.name_zh ?? '');
  })();

  return (
    <div
      id="filterPanel"
      className="flex-shrink-0 transition-all duration-300 overflow-hidden"
      style={{ width: filterCollapsed ? '60px' : '16.666667%' }}
    >
      <div className="bg-dark-800 rounded-xl border border-dark-600 p-5 sticky top-24 shadow-lg">
        <button
          type="button"
          id="filterToggle"
          title={t('filterPanelToggleTitle')}
          onClick={onToggleCollapse}
          className="w-full text-base font-mono font-semibold mb-4 flex items-center gap-2 text-slate-200 hover:text-accent transition-colors duration-200 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-dark-800 rounded-lg"
          style={{ justifyContent: filterCollapsed ? 'center' : 'space-between' }}
        >
          <div className="flex items-center gap-2 min-w-0" style={{ display: filterCollapsed ? 'none' : 'flex' }}>
            <Icon icon="mdi:filter" className="flex-shrink-0" />
            <span id="filterTitleText" className="truncate">
              {t('filterConditions')}
            </span>
          </div>
          <Icon
            id="filterToggleIcon"
            icon={filterCollapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'}
            className="transition-transform duration-200 flex-shrink-0"
            style={{ transform: filterCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
        <div id="filterContent" className="space-y-4" style={{ display: filterCollapsed ? 'none' : 'block' }}>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-slate-400">
              <Icon icon="mdi:earth" />
              <span>{t('leaderboardScope')}</span>
            </label>
            <div className="filter-dropdown relative" id="scopeDropdownWrap">
              <button
                type="button"
                id="scopeSelectTrigger"
                className="filter-select-trigger w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2.5 text-sm text-slate-200 text-left focus:ring-2 focus:ring-accent focus:border-accent/50 transition-colors duration-200 cursor-pointer"
                aria-haspopup="listbox"
                aria-expanded={scopeMenuOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setUnitMenuOpen(false);
                  setScopeMenuOpen((o) => !o);
                }}
              >
                <span id="scopeSelectLabel">{scopeLabel}</span>
              </button>
              <div
                id="scopeDropdownMenu"
                className={`filter-dropdown-menu ${scopeMenuOpen ? 'show' : ''}`}
                role="listbox"
                onWheel={preventFilterDropdownScrollChaining}
              >
                {scopes.map((s) => {
                  const name = s.name ?? s.name_zh ?? '';
                  if (!name) return null;
                  const display = lang === 'zh' ? (s.name_zh ?? s.name ?? name) : (s.name ?? s.name_zh ?? name);
                  const active = name === scopeValue;
                  return (
                    <div
                      key={name}
                      role="option"
                      className={`filter-dropdown-item ${active ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onScopeChange(name);
                        setScopeMenuOpen(false);
                      }}
                    >
                      {display}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-slate-400">
              <Icon icon="mdi:chart-bar" />
              <span>{t('rankingUnit')}</span>
            </label>
            <div className="filter-dropdown relative" id="unitDropdownWrap">
              <button
                type="button"
                id="unitSelectTrigger"
                className="filter-select-trigger w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2.5 text-sm text-slate-200 text-left focus:ring-2 focus:ring-accent focus:border-accent/50 transition-colors duration-200 cursor-pointer"
                aria-haspopup="listbox"
                aria-expanded={unitMenuOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setScopeMenuOpen(false);
                  setUnitMenuOpen((o) => !o);
                }}
              >
                <span id="unitSelectLabel">{unitLabel}</span>
              </button>
              <div
                id="unitDropdownMenu"
                className={`filter-dropdown-menu ${unitMenuOpen ? 'show' : ''}`}
                role="listbox"
                onWheel={preventFilterDropdownScrollChaining}
              >
                {filteredUnits.map((g) => {
                  const name = g.name ?? g.name_zh ?? '';
                  if (!name) return null;
                  const display = lang === 'zh' ? (g.name_zh ?? g.name ?? name) : (g.name ?? g.name_zh ?? name);
                  const active = name === unitValue;
                  return (
                    <div
                      key={name}
                      role="option"
                      className={`filter-dropdown-item ${active ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUnitChange(name);
                        setUnitMenuOpen(false);
                      }}
                    >
                      {display}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-slate-400">
              <Icon icon="mdi:calendar" />
              <span>{t('timeRangeType')}</span>
            </label>
            <div
              id="timeTypeToggleGroup"
              className="flex rounded-lg bg-dark-700 border border-dark-600 p-0.5"
              role="group"
              aria-label={t('timeRangeTypeToggle')}
            >
              <button
                type="button"
                id="timeTypeMonth"
                className={`detail-trend-toggle px-3 py-1.5 text-xs font-mono rounded-md text-slate-400 transition-colors flex-1 ${timeType === 'month' ? 'active' : ''}`}
                onClick={() => {
                  if (timeType === 'month') return;
                  onTimeTypeChange('month');
                  onTimeValueChange(computeInitialTimeValue('month', meta, timeValue));
                  onTimeCommit();
                }}
              >
                {t('byMonth')}
              </button>
              <button
                type="button"
                id="timeTypeYear"
                className={`detail-trend-toggle px-3 py-1.5 text-xs font-mono rounded-md text-slate-400 transition-colors flex-1 ${timeType === 'year' ? 'active' : ''}`}
                onClick={() => {
                  if (timeType === 'year') return;
                  onTimeTypeChange('year');
                  onTimeValueChange(computeInitialTimeValue('year', meta, timeValue));
                  onTimeCommit();
                }}
              >
                {t('byYear')}
              </button>
            </div>
          </div>
          <div id="timeRangeContainer">
            <TimeRangePicker
              meta={meta}
              timeType={timeType}
              timeValue={timeValue}
              lang={lang}
              t={t}
              onValueChange={onTimeValueChange}
              onCommit={onTimeCommit}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-slate-400">
              <Icon icon="mdi:magnify" />
              <span>{t('search')}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="openLeaderboardSearchInput"
                placeholder={t('searchPlaceholder')}
                value={searchKeyword}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2.5 pr-9 text-sm text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-accent focus:border-accent/50 hover:border-slate-500 hover:bg-dark-600/50 transition-colors duration-200"
              />
              <button
                type="button"
                id="searchClearBtn"
                title={t('clearSearch')}
                aria-label={t('clearSearch')}
                onClick={onSearchClear}
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-200 hover:bg-dark-600 transition-colors cursor-pointer ${searchKeyword.trim() ? '' : 'hidden'}`}
              >
                <Icon icon="mdi:close" className="text-base" />
              </button>
            </div>
          </div>
          <div id="paginationSection">{paginationSlot}</div>
        </div>
      </div>
    </div>
  );
}
