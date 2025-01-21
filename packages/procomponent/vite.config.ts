import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJSX from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite';
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
// import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@components': resolve(__dirname, 'src/components'),
    }
  },
  plugins: [vue(), vueJSX(), dts({
    tsconfigPath: "./tsconfig.lib.json"
    // include: ['src/**/*.ts', 'src/**/*.tsx']
  }),
  libInjectCss(),
  // createSvgIconsPlugin({
  //   iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
  //   symbolId: 'icon-[dir]-[name]',
  // }),
  Icons({
    compiler: 'vue3',
    autoInstall: true,
    customCollections: {
      'bm-icons': FileSystemIconLoader(
        './src/assets/icons',
        svg => svg.replace(/^<svg /, '<svg fill="currentColor" ')
      )
    }
  }),
  Components({
    resolvers: [NaiveUiResolver()],
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
        '@vueuse/core': [

        ]
      }
    ],
    dts: 'src/auto-imports.d.ts',
    dirs: ['src/hooks', 'src/components'],
    vueTemplate: true
  })
  ],

  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'index',
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? `index.js` : `index.cjs`
    },
    rollupOptions: {
      external: ['vue', 'naive-ui', '@vueuse/core'],
      output: {
        globals: {
          vue: 'Vue',
          'naive-ui': 'naive',
          '@vueuse/core': 'VueUse',
        }
      }
    }
  }
})
