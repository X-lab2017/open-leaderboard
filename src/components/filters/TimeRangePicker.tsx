import { Icon } from '@iconify/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lang, LeaderboardMeta } from '../../types/api';
import { MONTH_SHORT_NAMES } from '../../i18n/translations';
import { formatTimeDisplay, getTimeBounds } from '../../domain/timeRange';

type Props = {
  meta: LeaderboardMeta | null;
  timeType: 'month' | 'year';
  timeValue: string;
  lang: Lang;
  t: (k: string) => string;
  onValueChange: (v: string) => void;
  onCommit: () => void;
};

export function TimeRangePicker({ meta, timeType, timeValue, lang, t, onValueChange, onCommit }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const bounds = meta ? getTimeBounds(meta) : getTimeBounds(null);

  const closeOnOutside = useCallback(
    (e: MouseEvent) => {
      const wrap = wrapRef.current;
      if (wrap && !wrap.contains(e.target as Node)) {
        setOpen(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (open) {
      setTimeout(() => document.addEventListener('click', closeOnOutside), 0);
    } else {
      document.removeEventListener('click', closeOnOutside);
    }
    return () => document.removeEventListener('click', closeOnOutside);
  }, [open, closeOnOutside]);

  const stepTime = (delta: number) => {
    if (timeType === 'year') {
      const y = parseInt(timeValue || String(bounds.maxYear), 10);
      if ((delta < 0 && y <= bounds.minYear) || (delta > 0 && y >= bounds.maxYear)) return;
      const ny = Math.max(bounds.minYear, Math.min(bounds.maxYear, y + delta));
      onValueChange(String(ny));
 } else {
      const val = timeValue || bounds.maxMonth;
      if ((delta < 0 && val <= '2015-01') || (delta > 0 && val >= bounds.maxMonth)) return;
      const [y, m] = val.split('-').map(Number);
      const date = new Date(y, m - 1, 1);
      date.setMonth(date.getMonth() + delta);
      let nval = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (nval < '2015-01') nval = '2015-01';
      if (nval > bounds.maxMonth) nval = bounds.maxMonth;
      onValueChange(nval);
    }
    onCommit();
  };

  const stepYearInPicker = (delta: number) => {
    if (timeType === 'year') {
      const y = parseInt(timeValue || String(bounds.maxYear), 10);
      if ((delta < 0 && y <= bounds.minYear) || (delta > 0 && y >= bounds.maxYear)) return;
      const ny = Math.max(bounds.minYear, Math.min(bounds.maxYear, y + delta));
      onValueChange(String(ny));
    } else {
      const [y, m] = (timeValue || bounds.maxMonth).split('-').map(Number);
      if ((delta < 0 && y <= bounds.minYear) || (delta > 0 && y >= bounds.maxYear)) return;
      const ny = Math.max(bounds.minYear, Math.min(bounds.maxYear, y + delta));
      let val = `${ny}-${String(m).padStart(2, '0')}`;
      if (val > bounds.maxMonth) val = bounds.maxMonth;
      if (val < '2015-01') val = '2015-01';
      onValueChange(val);
    }
    onCommit();
  };

  const selectMonth = (month: number) => {
    const year = (timeValue || bounds.maxMonth).split('-')[0];
    const m = String(month).padStart(2, '0');
    const val = `${year}-${m}`;
    if (val < '2015-01' || val > bounds.maxMonth) return;
    onValueChange(val);
    setOpen(false);
    onCommit();
  };

  const prevDisabled =
    timeType === 'year'
      ? parseInt(timeValue || String(bounds.maxYear), 10) <= bounds.minYear
      : (timeValue || bounds.maxMonth) <= '2015-01';

  const nextDisabled =
    timeType === 'year'
      ? parseInt(timeValue || String(bounds.maxYear), 10) >= bounds.maxYear
      : (timeValue || bounds.maxMonth) >= bounds.maxMonth;

  const pickerYear = timeType === 'year' ? timeValue : (timeValue || bounds.maxMonth).split('-')[0];
  const yNum = parseInt(pickerYear, 10);
  const prevYearDisabled = yNum <= bounds.minYear;
  const nextYearDisabled = yNum >= bounds.maxYear;

  const monthNames = MONTH_SHORT_NAMES[lang];
  const currentMonth =
    timeType === 'month' ? parseInt((timeValue || '').split('-')[1] || '0', 10) || 0 : 0;
  const yearForGrid = (timeValue || bounds.maxMonth).split('-')[0];

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium mb-2 text-slate-400">
        <Icon icon="mdi:calendar" className="text-base" />
        <span>{t('timeSelection')}</span>
      </label>
      <div ref={wrapRef} className="relative">
        <div className="flex items-center bg-dark-700 border border-dark-600 rounded-lg overflow-hidden">
          <button
            type="button"
            aria-label={t('timePrev')}
            disabled={prevDisabled}
            onClick={(e) => {
              e.stopPropagation();
              stepTime(-1);
            }}
            className="time-picker-arrow flex items-center justify-center w-9 h-10 flex-shrink-0 text-slate-400 hover:text-accent hover:bg-dark-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset"
          >
            <Icon icon="mdi:chevron-left" className="text-lg" aria-hidden />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => !o);
            }}
            className="flex-1 flex items-center justify-center min-w-0 px-3 py-2.5 text-sm text-slate-200 hover:bg-dark-600/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset"
          >
            <span className="truncate">{formatTimeDisplay(timeValue, timeType, lang)}</span>
          </button>
          <button
            type="button"
            aria-label={t('timeNext')}
            disabled={nextDisabled}
            onClick={(e) => {
              e.stopPropagation();
              stepTime(1);
            }}
            className="time-picker-arrow flex items-center justify-center w-9 h-10 flex-shrink-0 text-slate-400 hover:text-accent hover:bg-dark-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset"
          >
            <Icon icon="mdi:chevron-right" className="text-lg" aria-hidden />
          </button>
        </div>
        <div className={`time-picker-dropdown ${open ? 'show' : ''}`}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <button
              type="button"
              aria-label={t('ariaPickerPreviousYear')}
              disabled={prevYearDisabled}
              onClick={(e) => {
                e.stopPropagation();
                stepYearInPicker(-1);
              }}
              className="time-picker-arrow flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-accent hover:bg-dark-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <Icon icon="mdi:chevron-left" className="text-lg" aria-hidden />
            </button>
            <span className="text-sm font-medium text-slate-200 flex-1 text-center">
              {timeType === 'year' ? timeValue : (timeValue || bounds.maxMonth).split('-')[0]}
            </span>
            <button
              type="button"
              aria-label={t('ariaPickerNextYear')}
              disabled={nextYearDisabled}
              onClick={(e) => {
                e.stopPropagation();
                stepYearInPicker(1);
              }}
              className="time-picker-arrow flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-accent hover:bg-dark-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <Icon icon="mdi:chevron-right" className="text-lg" aria-hidden />
            </button>
          </div>
          {timeType === 'month' && (
            <div className="flex flex-wrap gap-1">
              {monthNames.map((nm, i) => {
                const month = i + 1;
                const val = `${yearForGrid}-${String(month).padStart(2, '0')}`;
                const isInRange = val >= '2015-01' && val <= bounds.maxMonth;
                const isActive = month === currentMonth;
                return (
                  <button
                    key={month}
                    type="button"
                    disabled={!isInRange}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectMonth(month);
                    }}
                    className={
                      'time-picker-month-btn rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200 ' +
                      (isActive
                        ? 'bg-accent/20 text-accent border-accent/50 border'
                        : 'bg-dark-600 hover:bg-dark-500 hover:text-accent text-slate-300 border border-dark-500')
                    }
                  >
                    {nm}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
