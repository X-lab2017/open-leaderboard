/** Y-axis ticks (4–5 evenly spaced), matching legacy getYAxisTicks */
export function getYAxisTicks(maxVal: number): number[] {
  const max = Math.max(maxVal, 1);
  const step = Math.ceil(max / 4);
  const niceMax = step * 4;
  const ticks: number[] = [];
  for (let i = 0; i <= 4; i++) {
    ticks.push(Math.round((niceMax * i) / 4));
  }
  return ticks;
}

export function buildSmoothPath(points: number[][]): string {
  const n = points.length;
  if (n === 0) return '';
  if (n === 1) return 'M' + points[0][0] + ',' + points[0][1];
  if (n === 2) return 'M' + points[0][0] + ',' + points[0][1] + ' L' + points[1][0] + ',' + points[1][1];
  const parts = ['M' + points[0][0] + ',' + points[0][1]];
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(n - 1, i + 2)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    parts.push('C' + cp1x + ',' + cp1y + ' ' + cp2x + ',' + cp2y + ' ' + p2[0] + ',' + p2[1]);
  }
  return parts.join(' ');
}
