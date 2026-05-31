import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * 开发模式下将 /room-elves-card.es.js 映射到 Vite 实时编译的
 * src/custom-elements.ts，这样 HA 测试环境可以直接引用：
 *   http://192.168.0.119:5500/room-elves-card.es.js
 */
function serveLibraryEntry(): Plugin {
  return {
    name: 'serve-library-entry',
    apply: 'serve', // 仅在 dev server 生效
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/room-elves-card.es.js') {
          try {
            const result = await server.transformRequest('/src/custom-elements.ts')
            if (result) {
              res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.end(result.code)
              return
            }
          } catch (e) {
            console.error('[serve-library-entry] transform error:', e)
          }
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), serveLibraryEntry()],

  // ✅ 开发服务器
  server: {
    host: '0.0.0.0',
    port: 5500,
    // 允许 HA 跨域访问开发产物
    cors: true,
    // 开发时输出文件名（不带 hash，方便调试）
    origin: 'http://localhost:5500',
  },

  build: {
    lib: {
      entry: 'src/custom-elements.ts',
      formats: ['es'],
      // 固定文件名 — HA 资源引用需要稳定 URL（如 /local/room-elves-card.es.js）
      fileName: () => `room-elves-card.es.js`,
    },
    rollupOptions: {
      output: {
        // CSS 也用固定文件名，避免 HA 找不到资源
        assetFileNames: 'room-elves-card.[ext]',
      },
    },
    cssCodeSplit: false,
    minify: 'esbuild',
  },
})
