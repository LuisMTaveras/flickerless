import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: { alias: { 'react-native': fileURLToPath(new URL('./test/react-native.mock.tsx', import.meta.url)) } },
  esbuild: { jsx: 'automatic' },
  test: { environment: 'jsdom' },
});
