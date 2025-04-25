/// <reference types="node" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  base: '/', //  明确指定生产路径（重要）
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          gmapApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY, //  读取 .env 中的 key
        },
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
