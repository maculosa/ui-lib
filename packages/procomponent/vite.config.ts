/// <reference types="vitest/config" />

import { resolve } from 'path'
// import { promises as fs } from 'node:fs'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJSX from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite';
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import compression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log(env.NODE_ENV)
  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@components': resolve(__dirname, 'src/components'),
        '@styles': resolve(__dirname, 'src/styles'),
      }
    },
    plugins: [
      vue(),
      vueJSX(),
      dts({
        tsconfigPath: "./tsconfig.lib.json"
      }),
      tailwindcss(),
      libInjectCss(),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), './assets/icons')],
        symbolId: 'icon-local-[dir]-[name]',
        inject: 'body-last',
        customDomId: '__SVG_ICON_LOCAL__',
      }),
      Icons({
        compiler: 'vue3',
        autoInstall: true,
        customCollections: {
          'bm-icon': FileSystemIconLoader(
            './src/assets/icons',
            svg => svg.replace(/^<svg\s/, '<svg fill="currentColor" width="1em" height="1em" ')
          )
        },
        scale: 1,
        defaultStyle: 'display: inline-block;',
      }),
      Components({
        resolvers: [
          NaiveUiResolver(),
          IconsResolver({
            customCollections: ['bm-icon'],
          })
        ],
        dts: 'src/components.d.ts',
      }),
      AutoImport({
        imports: [
          'vue',
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar',
            ],
          },
          {
            '@vueuse/core': []
          }
        ],
        dts: 'src/auto-imports.d.ts',
        dirs: ['src/hooks', 'src/components'],
        vueTemplate: true
      }),
      compression(), // 启用 gzip 压缩
      visualizer({
        filename: 'stats.html',
        gzipSize: true,
        brotliSize: true,
      })
    ],
    build: {
      // copyPublicDir: false,
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'index',
        formats: ['es'],
        fileName: 'index'
      },
      rollupOptions: {
        external: ['vue', 'naive-ui', '@vueuse/core', 'vue-router', '@banmao/draw',  /^@iconify\/.*$/, /^@?icons-vue\/.*$/],
        output: {
          globals: {
            vue: 'Vue',
            'naive-ui': 'NaiveUI',
            '@vueuse/core': 'VueUse',
            '@banmao/draw': 'Draw',
          },
          // manualChunks: {
          //   'icons': ['@iconify/vue']
          // }
        }
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    test: {
      include: ['**/*.{test,spec}.ts'],
      environment: 'happy-dom',
      globals: true,
    }
  }
})
