import { useEffect, useMemo, useState } from 'react';
import type { Lang, LeaderboardMeta } from '../../types/api';
import {
  buildCommunityOpenRankDisplayRows,
  getCommunityOpenRankDataBounds,
  type CommunityOpenRankDetailsFile,
} from '../../domain/communityOpenRankDetails';
import { TimeRangePicker } from '../filters/TimeRangePicker';
import { LeaderboardAvatar } from '../leaderboard/LeaderboardAvatar';
import { PaginationControl } from '../leaderboard/PaginationControl';
import { DeltaDisplay } from '../leaderboard/DeltaDisplay';
import { getDeveloperProfileUrlByPlatform } from '../../domain/repoPlatform';
import { RepoPlatformIcon } from './RepoPlatformIcon';

const PAGE_SIZE = 10;

type Props = {
  details: CommunityOpenRankDetailsFile;
  meta: LeaderboardMeta | null;
  timeType: 'month' | 'year';
  sectionTimeValue: string;
  onSectionTimeChange: (v: string) => void;
  lang: Lang;
  t: (k: string) => string;
};

export function CommunityDeveloperOpenRank({
  details,
  meta,
  timeType,
  sectionTimeValue,
  onSectionTimeChange,
  lang,
  t,
}: Props) {
  const [page, setPage] = useState(1);

  const dataBounds = useMemo(() => getCommunityOpenRankDataBounds(details, timeType), [details, timeType]);

  const rows = useMemo(
    () => buildCommunityOpenRankDisplayRows(details, timeType, sectionTimeValue, meta, dataBounds),
    [details, timeType, sectionTimeValue, meta, dataBounds],
  );

  useEffect(() => {
    if (!dataBounds) return;
    const v = sectionTimeValue;
    if (timeType === 'year') {
      const y = parseInt(v, 10);
      if (Number.isNaN(y) || y < dataBounds.minYear || y > dataBounds.maxYear) {
        const clamped = Math.min(Math.max(Number.isNaN(y) ? dataBounds.maxYear : y, dataBounds.minYear), dataBounds.maxYear);
        onSectionTimeChange(String(clamped));
      }
    } else {
      if (v < dataBounds.minMonth || v > dataBounds.maxMonth) {
        onSectionTimeChange(v < dataBounds.minMonth ? dataBounds.minMonth : dataBounds.maxMonth);
      }
    }
  }, [dataBounds, timeType, sectionTimeValue, onSectionTimeChange]);

  const totalPages = rows.length === 0 ? 0 : Math.ceil(rows.length / PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [details, timeType, sectionTimeValue]);

  useEffect(() => {
    if (totalPages <= 0) return;
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, page]);

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 mb-3">
        <h4 className="text-sm font-mono font-semibold text-slate-300">{t('detailCommunityDevelopersHeading')}</h4>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:justify-end">
          <div className="min-w-[9rem] w-40 sm:min-w-[9.5rem] sm:w-44 flex-shrink-0">
            <TimeRangePicker
              meta={meta}
              timeType={timeType}
              timeValue={sectionTimeValue}
              lang={lang}
              t={t}
              hideOuterLabel
              dense
              boundsOverride={dataBounds}
              onValueChange={onSectionTimeChange}
              onCommit={() => {}}
            />
          </div>
          {totalPages > 0 ? (
            <div className="w-[8rem] sm:w-36 flex-shrink-0">
              <PaginationControl
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                compact
                dense
                showWhenSinglePage
              />
            </div>
          ) : null}
        </div>
      </div>
      <div className="rounded-lg border border-dark-600 bg-dark-800/40">
        {rows.length === 0 ? (
          <p className="text-slate-500 text-sm py-8 text-center font-mono">{t('noData')}</p>
        ) : (
          <div className="divide-y divide-dark-600/50">
            <div
              className="flex items-center gap-2 py-2 px-2 bg-dark-800/70"
              role="row"
            >
              <div
                className="flex-shrink-0 w-[4.25rem] text-[10px] sm:text-xs font-mono font-semibold text-slate-500 text-center leading-tight"
                role="columnheader"
              >
                {t('detailCommunityColRank')}
              </div>
              <span
                className="flex-shrink-0 flex w-8 h-6 items-center justify-center text-[10px] sm:text-xs font-mono font-semibold text-slate-500 text-center leading-tight"
                role="columnheader"
              >
                {t('detailCommunityColPlatform')}
              </span>
              <div className="w-7 flex-shrink-0" aria-hidden />
              <div
                className="flex-1 min-w-0 text-[10px] sm:text-xs font-mono font-semibold text-slate-500"
                role="columnheader"
              >
                {t('headerName')}
              </div>
              <div className="flex-shrink-0 flex items-center justify-end gap-3" role="presentation">
                <div
                  className="w-28 text-right shrink-0 text-[10px] sm:text-xs font-mono font-semibold text-slate-500"
                  role="columnheader"
                >
                  {t('headerOpenRank')}
                </div>
                <div
                  className="w-24 text-right shrink-0 text-[10px] sm:text-xs font-mono font-semibold text-slate-500"
                  role="columnheader"
                >
                  {t('detailCommunityColChange')}
                </div>
              </div>
            </div>
            {pageRows.map((r) => {
              const profileUrl = getDeveloperProfileUrlByPlatform(r.platform, r.login);
              const nameCls = 'font-medium text-xs text-slate-200 truncate block leading-tight';
              return (
                <div
                  key={`${r.platform}-${r.id}-${r.login}`}
                  className="flex items-center gap-2 py-1 px-2 min-h-0 hover:bg-dark-700/30 transition-colors"
                >
                  <div className="flex-shrink-0 flex items-center gap-1 w-[4.25rem]">
                    <span className="text-xs font-mono font-bold text-slate-400 w-6 text-center tabular-nums">
                      {r.rank}
                    </span>
                    <DeltaDisplay value={r.rankDelta} isInt compact />
                  </div>
                  <span
                    className="flex-shrink-0 flex items-center justify-center w-8 h-6"
                    title={r.platform}
                    aria-label={r.platform}
                  >
                    <RepoPlatformIcon platform={r.platform} size="xs" />
                  </span>
                  <div className="w-7 h-7 flex-shrink-0 relative">
                    <LeaderboardAvatar
                      avatar={r.avatarUrl}
                      displayName={r.login}
                      sizeClass="w-7 h-7"
                      circular
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    {profileUrl === '#' ? (
                      <span className={nameCls}>{r.login}</span>
                    ) : (
                      <a
                        href={profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${nameCls} hover:text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded`}
                      >
                        {r.login}
                      </a>
                    )}
                  </div>
                  <div className="flex-shrink-0 flex items-center justify-end gap-3">
                    <div className="w-28 text-right shrink-0">
                      <span className="text-sm font-mono font-bold text-slate-300 tabular-nums leading-none">
                        {r.score.toFixed(1)}
                      </span>
                    </div>
                    <div className="w-24 flex justify-end shrink-0">
                      <DeltaDisplay value={r.openrankDelta} compact />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
