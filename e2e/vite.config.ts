import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [vue(), react()],
  build: {
    rollupOptions: {
      input: { vue: resolve(__dirname, 'vue.html'), react: resolve(__dirname, 'react.html'), element: resolve(__dirname, 'element.html') },
    },
  },
});
