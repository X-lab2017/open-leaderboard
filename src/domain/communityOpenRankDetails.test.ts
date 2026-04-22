import { describe, expect, it } from 'vitest';
import { inferredDeveloperAvatarUrl } from './communityOpenRankDetails';

describe('inferredDeveloperAvatarUrl', () => {
  it('uses github login.png without oss id', () => {
    expect(inferredDeveloperAvatarUrl('github', 'octocat', undefined)).toBe(
      'https://github.com/octocat.png',
    );
  });

  it('returns empty for gitlab until numeric id is known', () => {
    expect(inferredDeveloperAvatarUrl('gitlab', 'someone', undefined)).toBe('');
    expect(inferredDeveloperAvatarUrl('gitlab', 'someone', '')).toBe('');
  });

  it('builds gitlab avatar path when id is present', () => {
    expect(inferredDeveloperAvatarUrl('gitlab', 'someone', '12345')).toBe(
      'https://gitlab.com/uploads/-/system/user/avatar/12345/avatar.png',
    );
  });

  it('respects login first path segment', () => {
    expect(inferredDeveloperAvatarUrl('github', 'foo/bar', undefined)).toBe(
      'https://github.com/foo.png',
    );
  });
});
