import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    // Library mode: produces a single JS file for HA custom element registration
    lib: {
      entry: 'src/custom-elements.ts',
      formats: ['es'],
      fileName: () => 'room-elves-card.js',
    },
    rollupOptions: {
      output: {
        // Ensure all CSS is inlined into the JS for single-file HA deployment
        // When no CSS file means all styles are embedded in custom elements shadow DOM
      },
    },
    cssCodeSplit: false,
    minify: 'esbuild',
  },
})
