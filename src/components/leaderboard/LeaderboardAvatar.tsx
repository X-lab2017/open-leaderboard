import { useState } from 'react';
import { getAvatarColor, getInitial } from '../../domain/leaderboard';

export function LeaderboardAvatar({
  avatar,
  displayName,
  sizeClass = 'w-9 h-9',
}: {
  avatar: string;
  displayName: string;
  sizeClass?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initial = getInitial(displayName);
  const avatarColor = getAvatarColor(displayName);
  const isFlagCdn = typeof avatar === 'string' && avatar.includes('flagcdn.com');
  const imgFitClass = isFlagCdn ? 'object-contain bg-dark-800' : 'object-cover';

  if (avatar && !failed) {
    return (
      <img
        src={avatar}
        alt={displayName}
        className={`${sizeClass} rounded border-2 border-dark-600 ${imgFitClass}`}
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div
      className={`${sizeClass} rounded border-2 border-dark-600 flex items-center justify-center text-white font-bold text-sm`}
      style={{ backgroundColor: avatarColor }}
    >
      {initial}
    </div>
  );
}
