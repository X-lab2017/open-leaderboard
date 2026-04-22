import { useEffect, useState } from 'react';
import { getAvatarColor, getInitial } from '../../domain/leaderboard';

export function LeaderboardAvatar({
  avatar,
  displayName,
  sizeClass = 'w-9 h-9',
  circular = false,
}: {
  avatar: string;
  displayName: string;
  sizeClass?: string;
  /**圆形裁剪（常用于开发者头像） */
  circular?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [avatar]);
  const initial = getInitial(displayName);
  const avatarColor = getAvatarColor(displayName);
  const isFlagCdn = typeof avatar === 'string' && avatar.includes('flagcdn.com');
  const imgFitClass = isFlagCdn ? 'object-contain bg-dark-800' : 'object-cover';
  const radiusClass = circular ? 'rounded-full' : 'rounded';

  if (avatar && !failed) {
    return (
      <img
        src={avatar}
        alt={displayName}
        referrerPolicy="no-referrer"
        className={`${sizeClass} ${radiusClass} border-2 border-dark-600 ${imgFitClass}`}
        onError={() => setFailed(true)}
      />
    );
  }
  const initialTextClass = circular ? 'text-xs' : 'text-sm';
  return (
    <div
      className={`${sizeClass} ${radiusClass} border-2 border-dark-600 flex items-center justify-center text-white font-bold ${initialTextClass}`}
      style={{ backgroundColor: avatarColor }}
    >
      {initial}
    </div>
  );
}
