import * as echarts from 'echarts';
import { useEffect, useRef, useState } from 'react';
import type { ContributionRow } from '../../types/api';
import { preprocessContributions } from '../../domain/geography';
import { WORLD_GEOJSON_URL } from '../../api/constants';
import { useI18n } from '../../i18n/I18nProvider';

type Props = {
  contributions: ContributionRow[];
};

export function ContributionMap({ contributions }: Props) {
  const { t, lang } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const optionRef = useRef<echarts.EChartsOption | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const processed = preprocessContributions(contributions);
  const hasData = processed.length > 0;

  useEffect(() => {
    setMapReady(false);
    setLoadError(false);
    const proc = preprocessContributions(contributions);
    if (proc.length === 0) return;

    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;

    const mapData = proc.map((c) => ({
      name: c.mapName,
      value: Math.log(c.openrank + 1),
      openrank: c.openrank,
      developers: c.developers ?? 0,
      countryCode: c.countryCode,
      displayNameZh: c.displayNameZh,
      displayNameEn: c.displayNameEn,
    }));
    const maxValue = Math.max(...mapData.map((d) => d.value));

    const chart = echarts.init(container);
    chartRef.current = chart;

    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);

    fetch(WORLD_GEOJSON_URL)
      .then((res) => res.json())
      .then((worldJson) => {
        if (cancelled) return;
        echarts.registerMap('world', worldJson);
        const option: echarts.EChartsOption = {
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            borderColor: '#475569',
            borderWidth: 1,
            textStyle: { color: '#e2e8f0', fontSize: 12 },
            formatter(params: unknown) {
              const p = params as {
                name?: string;
                data?: {
                  openrank?: number;
                  value?: number;
                  developers?: number;
                  displayNameZh?: string;
                  displayNameEn?: string;
                  countryCode?: string | null;
                };
              };
              const openrank =
                (p.data?.openrank != null ? p.data.openrank : (p as { value?: number }).value) ?? 0;
              const displayVal = Number(openrank);
              const safeVal = typeof displayVal === 'number' && !Number.isNaN(displayVal) ? displayVal : 0;
              const developers =
                p.data?.developers != null && typeof p.data.developers === 'number' ? p.data.developers : 0;
              const countryDisplay =
                lang === 'zh' ? p.data?.displayNameZh || p.name : p.data?.displayNameEn || p.name;
              const devLabel = t('mapTooltipDevelopers');
              const flagCode = p.data?.countryCode;
              const flagImg = flagCode
                ? `<img src="https://flagcdn.com/24x18/${flagCode.toLowerCase()}.png" alt="" style="vertical-align:middle;margin-right:4px;width:24px;height:18px;">`
                : '';
              return `<div style="font-weight:600">${flagImg}${countryDisplay}</div><div>${t('headerOpenRank')}: ${safeVal.toLocaleString()}</div><div>${devLabel}: ${developers.toLocaleString()}</div>`;
            },
          },
          visualMap: {
            min: 0,
            max: maxValue,
            left: 'left',
            bottom: '10',
            text: [t('mapVisualHigh'), t('mapVisualLow')],
            formatter: () => '',
            textStyle: { color: '#94a3b8' },
            calculable: true,
            inRange: { color: ['#064e3b', '#065f46', '#047857', '#059669', '#10b981'] },
          },
          series: [
            {
              name: t('mapSeriesName'),
              type: 'map',
              map: 'world',
              roam: true,
              emphasis: {
                label: { show: true, color: '#f1f5f9' },
                itemStyle: { areaColor: '#86efac' },
              },
              itemStyle: {
                areaColor: '#334155',
                borderColor: '#475569',
                borderWidth: 0.5,
              },
              label: { show: false },
              data: mapData,
            },
          ],
        };
        optionRef.current = option;
        chart.setOption(option);
        setMapReady(true);
      })
      .catch((err) => {
        console.error('Failed to load world map:', err);
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
      chart.dispose();
      chartRef.current = null;
      optionRef.current = null;
    };
   }, [contributions, lang, t]);

  const resetMap = () => {
    const chart = chartRef.current;
    const opt = optionRef.current;
    if (chart && opt) {
      chart.clear();
      chart.setOption(opt);
    }
  };

  return (
    <div className="relative flex-1 min-w-0" style={{ width: '60%' }}>
      {!hasData && (
        <div
          id="contributionMapContainer"
          className="bg-dark-800 rounded-lg p-4 border border-dark-600"
          style={{ height: 320 }}
        >
          <p className="text-slate-500 text-sm py-4 text-center">{t('noData')}</p>
        </div>
      )}
      {hasData && loadError && (
        <div
          className="bg-dark-800 rounded-lg p-4 border border-dark-600"
          style={{ height: 320 }}
        >
          <p className="text-slate-500 text-sm py-4 text-center">{t('mapLoadFailed')}</p>
        </div>
      )}
      {hasData && !loadError && (
        <>
          <div
            ref={containerRef}
            id="contributionMapContainer"
            className="bg-dark-800 rounded-lg p-4 border border-dark-600"
            style={{ height: 320 }}
          />
          {mapReady && (
            <button
              id="contributionMapResetBtn"
              type="button"
              className="absolute top-6 right-6 px-2 py-1 text-xs rounded bg-dark-700 border border-dark-600 text-slate-300 hover:bg-dark-600 hover:text-slate-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
              title={t('mapResetTitle')}
              onClick={resetMap}
            >
              {t('mapReset')}
            </button>
          )}
        </>
      )}
    </div>
  );
}
