import { Icon } from '@iconify/react';
import { OPEN_DIGGER_PLATFORM_LOGO_BASE } from '../../api/constants';
import { normalizeRepoPlatform } from '../../domain/repoPlatform';

export function RepoPlatformIcon({ platform, size }: { platform: unknown; size: 'sm' | 'xs' | 'md' }) {
  const p = normalizeRepoPlatform(platform);
  const imgCls = size === 'md' ? 'w-4 h-4' : size === 'sm' ? 'w-3.5 h-3.5' : 'w-3 h-3';
  const wh = size === 'md' ? 16 : size === 'sm' ? 14 : 12;
  if (p === 'github') {
    return (
      <Icon
        icon="mdi:github"
        className={`${imgCls} flex-shrink-0 inline-block align-middle`}
        width={wh}
        height={wh}
        aria-hidden
      />
    );
  }
  const src = `${OPEN_DIGGER_PLATFORM_LOGO_BASE}${p}.png`;
  return (
    <img
      src={src}
      alt=""
      className={`${imgCls} flex-shrink-0 object-contain inline-block align-middle`}
      width={wh}
      height={wh}
      decoding="async"
    />
  );
}
