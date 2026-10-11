import { defineConfig } from '@playwright/test';

// CI instala su Chromium (`pnpm exec playwright install --with-deps chromium`);
// en local se puede apuntar a uno ya instalado con PW_CHROMIUM_PATH.
const executablePath = process.env.PW_CHROMIUM_PATH;

export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:4317', launchOptions: executablePath ? { executablePath } : {} },
  webServer: { command: 'pnpm exec vite preview --port 4317 --strictPort', port: 4317, reuseExistingServer: !process.env.CI },
});
