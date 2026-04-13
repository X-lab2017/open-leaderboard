import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * 部署在子路径时（如 https://example.com/open-leaderboard/），构建前设置：
 *   DEPLOY_BASE=/open-leaderboard/
 * 或在 .env.production 中写入同一变量。
 * 根目录部署使用默认 `/` 即可。
 */
function normalizeDeployBase(raw: string | undefined): string {
  let b = (raw ?? '').trim();
  if (!b || b === '/') return '/';
  if (!b.startsWith('/')) b = `/${b}`;
  if (!b.endsWith('/')) b = `${b}/`;
  return b;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = normalizeDeployBase(
    process.env.DEPLOY_BASE ||
      process.env.VITE_DEPLOY_BASE ||
      env.DEPLOY_BASE ||
      env.VITE_DEPLOY_BASE,
  );

  return {
    plugins: [react()],
    base,
  };
});
