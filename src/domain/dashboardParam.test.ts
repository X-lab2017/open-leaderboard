import { describe, expect, it } from 'vitest';
import { parseDashboardLeaderboardItem } from './dashboardParam';

describe('parseDashboardLeaderboardItem', () => {
  it('parses label with leading colon', () => {
    expect(parseDashboardLeaderboardItem(':foo/bar')).toEqual({ id: ':foo/bar', itemType: 'label' });
  });

  it('parses developer as platform/login', () => {
    expect(parseDashboardLeaderboardItem('github/octocat')).toEqual({
      platform: 'github',
      login: 'octocat',
      name: 'octocat',
      itemType: 'developer',
    });
  });

  it('parses repo as platform/owner/repo', () => {
    expect(parseDashboardLeaderboardItem('github/foo/bar')).toEqual({
      platform: 'github',
      name: 'foo/bar',
      itemType: 'repo',
    });
  });

  it('rejects unknown platform', () => {
    expect(parseDashboardLeaderboardItem('unknown/octocat')).toBeNull();
  });

  it('rejects single segment', () => {
    expect(parseDashboardLeaderboardItem('github')).toBeNull();
  });
});
