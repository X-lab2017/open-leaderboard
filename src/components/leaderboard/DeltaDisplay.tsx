import { Icon } from '@iconify/react';

export function DeltaDisplay({
  value,
  isInt,
  compact,
}: {
  value: number | null | undefined;
  isInt?: boolean;
  /** 更小的字号，适合与主数值同一行 */
  compact?: boolean;
}) {
  const textCls = compact ? 'text-xs' : 'text-sm';
  const iconCls = compact ? 'text-sm' : 'text-base';
  if (value == null || Number.isNaN(value)) {
    return (
      <span className={`inline-flex items-center ${textCls} font-semibold text-slate-500`}>
        <span>-</span>
      </span>
    );
  }
  const display = isInt ? Math.round(Math.abs(value)) : Math.abs(value).toFixed(1);
  if (value > 0) {
    return (
      <span className={`inline-flex items-center gap-0.5 ${textCls} font-semibold text-green-400`}>
        <Icon icon="mdi:arrow-up" className={iconCls} aria-hidden />
        <span>{display}</span>
      </span>
    );
  }
  if (value < 0) {
    return (
      <span className={`inline-flex items-center gap-0.5 ${textCls} font-semibold text-red-400`}>
        <Icon icon="mdi:arrow-down" className={iconCls} aria-hidden />
        <span>{display}</span>
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center ${textCls} font-semibold text-slate-500`}>
      <span>-</span>
    </span>
  );
}
