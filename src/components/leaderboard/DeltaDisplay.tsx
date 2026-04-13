import { Icon } from '@iconify/react';

export function DeltaDisplay({ value, isInt }: { value: number; isInt?: boolean }) {
  const display = isInt ? Math.round(Math.abs(value)) : Math.abs(value).toFixed(1);
  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-400">
        <Icon icon="mdi:arrow-up" className="text-base" aria-hidden />
        <span>{display}</span>
      </span>
    );
  }
  if (value < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-400">
        <Icon icon="mdi:arrow-down" className="text-base" aria-hidden />
        <span>{display}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-sm font-semibold text-slate-500">
      <span>-</span>
    </span>
  );
}
