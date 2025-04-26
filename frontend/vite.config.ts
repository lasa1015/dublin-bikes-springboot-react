/// <reference types="node" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  base: '/', // 明确指定生产路径（重要）
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          gmapApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY, // 读取 .env 中的 key
        },
      },
    }),
  ],

  // 本地开发时，访问 /api/xxx 的请求，自动代理到 http://localhost:8080（也就是你本地跑的后端）。
  // 构建打包（npm run build）时，这段配置不会进入最终前端静态资源，生产环境不走代理，直接按路径访问 nginx 提供的后端接口。
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },

  // 新增构建优化配置：构建时去除 console.log 和 debugger
  build: {
    sourcemap: false,  // 打包时不生成 .map 文件,浏览器控制台也无法反查源代码
    terserOptions: {
      compress: {
        drop_console: true,    // 删除所有 console.log / console.info / console.debug（但是保留 console.error 和 console.warn）
        drop_debugger: true,   // 删除所有 debugger 语句
      },
    },
  },
});
