import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJSX from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJSX(), dts({
    tsconfigPath: "./tsconfig.lib.json"
  }), libInjectCss()],
  build: {
    copyPublicDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'index',
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? `index.js` : `index.cjs`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
