import { describe, expect, it } from 'vitest';
import { buildDataUrl } from './leaderboard';

describe('buildDataUrl', () => {
  it('builds month URL without leading zero on month segment', () => {
    expect(
      buildDataUrl({
        scopeName: 'Global',
        groupTypeName: 'Project',
        timeType: 'month',
        timeValue: '2024-03',
      }),
    ).toBe('https://oss.open-digger.cn/open_leaderboard/global/project/month/20243/data.json');
  });

  it('builds year URL', () => {
    expect(
      buildDataUrl({
        scopeName: 'Global',
        groupTypeName: 'Repo',
        timeType: 'year',
        timeValue: '2023',
      }),
    ).toBe('https://oss.open-digger.cn/open_leaderboard/global/repo/year/2023/data.json');
  });
});
