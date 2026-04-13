import { useEffect, useRef } from 'react';
import { buildSmoothPath, getYAxisTicks } from '../../domain/chartSvg';

type Props = {
  values: number[];
  label: string;
  monthLabels: string[];
  noDataText: string;
};

export function TrendChart({ values, label, monthLabels, noDataText }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const tooltipEl = wrap.querySelector('.trend-chart-tooltip');
    if (!tooltipEl) return;
    let data: { labels: string[]; values: number[] };
    try {
      const raw = wrap.getAttribute('data-trend-data');
      if (!raw) return;
      data = JSON.parse(raw);
    } catch {
      return;
    }
    const { labels = [], values: vals = [] } = data;
    const n = Math.min(labels.length, vals.length);
    if (n === 0) return;
    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const i = Math.min(n - 1, Math.max(0, Math.round(x * (n - 1))));
      const lb = labels[i] != null ? labels[i] : '';
      const val = vals[i] != null ? Number(vals[i]) : 0;
      tooltipEl.textContent = `${lb}: ${val}`;
      tooltipEl.classList.add('visible');
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      requestAnimationFrame(() => {
        const ttRect = tooltipEl.getBoundingClientRect();
        let left = relX - ttRect.width / 2;
        left = Math.max(4, Math.min(rect.width - ttRect.width - 4, left));
        (tooltipEl as HTMLElement).style.left = left + 'px';
        (tooltipEl as HTMLElement).style.top = Math.max(4, relY - ttRect.height - 8) + 'px';
      });
    };
    const onLeave = () => tooltipEl.classList.remove('visible');
    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseleave', onLeave);
    return () => {
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseleave', onLeave);
    };
  }, [values, monthLabels, label, noDataText]);

  let labels: string[];
  if (monthLabels && monthLabels.length > 0) {
    if (monthLabels.length >= values.length) {
      labels = monthLabels.slice(0, values.length);
    } else {
      const last = monthLabels[monthLabels.length - 1] || '';
      labels = [...monthLabels, ...Array(values.length - monthLabels.length).fill(last)];
    }
  } else {
    labels = values.length ? values.map(() => '') : [];
  }
  const max = Math.max(...values, 1);
  const yTicks = getYAxisTicks(max);
  const displayMax = yTicks[yTicks.length - 1];
  const n = values.length;
  if (n === 0) {
    return (
      <div className="mb-4">
        <div className="text-sm font-mono text-slate-400 mb-2">{label}</div>
        <div className="flex gap-2 items-center h-20 text-slate-500 text-sm">{noDataText}</div>
      </div>
    );
  }
  const pad = 2;
  const w = 100 - pad * 2;
  const h = 100 - pad * 2;
  const points = values.map((v, i) => {
    const x = n === 1 ? 50 : pad + (i / (n - 1)) * w;
    const y = pad + h - (Number(v) / displayMax) * h;
    return [x, y] as [number, number];
  });
  const linePath = buildSmoothPath(points as number[][]);
  const areaPath = linePath + ' L' + (pad + w) + ',' + (pad + h) + ' L' + pad + ',' + (pad + h) + ' Z';
  const trendDataJson = JSON.stringify({ labels, values })
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;');

  return (
    <div className="mb-4">
      <div className="text-sm font-mono text-slate-400 mb-2">{label}</div>
      <div className="flex gap-2">
        <div className="flex flex-col justify-between text-xs text-slate-500 font-mono h-20 py-0.5 flex-shrink-0">
          {yTicks
            .slice()
            .reverse()
            .map((tk) => (
              <span key={tk}>{tk}</span>
            ))}
        </div>
        <div
          ref={wrapRef}
          className="flex-1 min-w-0 h-20 flex flex-col trend-chart-wrap"
          style={{ minHeight: '5rem' }}
          data-trend-data={trendDataJson}
        >
          <svg className="w-full flex-1 min-h-0" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <path d={areaPath} fill="rgba(34,197,94,0.2)" />
            <path
              d={linePath}
              fill="none"
              stroke="#22C55E"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="trend-chart-tooltip" role="tooltip" />
          <div className="flex justify-between text-xs text-slate-500 mt-1 flex-shrink-0">
            <span>{labels[0] || ''}</span>
            <span>{labels[labels.length - 1] || ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
