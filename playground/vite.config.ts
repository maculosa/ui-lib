import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { join } from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJSX from '@vitejs/plugin-vue-jsx'
// import VueRouter from 'unplugin-vue-router/vite'
import Inspect from 'vite-plugin-inspect'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import Markdown from 'unplugin-vue-markdown/vite'
import VueRouter from 'unplugin-vue-router/vite'
// import prism from 'markdown-it-prism'
import { full as emoji } from 'markdown-it-emoji'
import hljs from 'highlight.js'
// import highlightjsIt from 'markdown-it-highlightjs'
import markdownItAttrs from 'markdown-it-attrs'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItTOC from 'markdown-it-toc-done-right'
import uslug from 'uslug'
import Icons from 'unplugin-icons/vite'
import Unocss from 'unocss/vite'
// import { promises as fs } from 'fs'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Layouts from 'vite-plugin-vue-layouts'
import { MarkdownTransform } from "./build/plugins/md-transform"

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/], // <-- allows Vue to compile markdown files
    }),
    vueJSX(),
    MarkdownTransform(),
    Markdown({
      markdownItOptions: {
        highlight: (str, lang) => {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return `<pre><code class="hljs">${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
            } catch (__) { }
          }
          else if (lang === 'vue') {
            return `<pre><code class="hljs">${hljs.highlight(str, { language: 'xml', ignoreIllegals: true }).value}</code></pre>`
          }

          return `<pre><code class="hljs">${''}</code></pre>` // use external default escaping
        },
      },
      headEnabled: true,
      markdownItUses: [emoji, markdownItAttrs,
        [markdownItAnchor, {
          // permalink: true,
          permalinkBefore: true,
          permalinkSymbol: '§',
          permalinkSpace: false,
          permalinkClass: 'anchor',
          level: [1, 2, 3],
        }],
        [markdownItTOC, {
          slugify: (s: any) => uslug(s)
        }],
        // [highlightjsIt, {
        //   inline: true,
        //   register: {
        //     vue: () => import('highlight.js/lib/languages/xml'),
        //   }
        // }]
      ],
      markdownItSetup(md) {
        md.use(markdownItAnchor, {
          permalink: true,
          permalinkBefore: true,
          // permalinkSymbol: '#',
          permalinkSymbol: '',
          permalinkAttrs: () => ({ 'aria-hidden': true })
        })
      }
    }),
    Unocss(),
    VueRouter({
      extensions: ['.vue', '.md'],
      importMode: 'async',
      routesFolder: [
        { src: 'src/pages' },
        { src: 'src/docs',
          path: 'docs/',
          extensions: ['.md']
         }
      ],
      dts: 'types/typed-router.d.ts',
      exclude: [
        '**/__*',
        '**/__**/*',
        '**/*.component.vue',
        '**/examples/*.vue'
      ],
      logs: true,
      routeBlockLang: 'yaml',
    }),
    Layouts({
      pagesDirs: ['src/docs', 'src/pages'],
      extensions: ['vue', 'md'],
      defaultLayout: 'default',
    }),
    Inspect(),
    Icons({
      compiler: 'vue3',
      autoInstall: true,
      customCollections: {
        'bm-icon': FileSystemIconLoader(
          './src/assets/icons',
          svg => svg.replace(/^<svg /, '<svg fill="currentColor" ')
        )
      }
    }),
    AutoImport({
      imports: [
        'vue',
        '@vueuse/head',
        '@vueuse/core',
        VueRouterAutoImports,
        {
          // add any other imports you were relying on
          'vue-router/auto': ['useLink']
        }
      ],
      dts: 'types/auto-imports.d.ts'
    }),
    Components({
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [NaiveUiResolver()],
      dts: 'types/components.d.ts',
      extensions: ['vue', 'md']
    }),
  ],
  server: {
    port: 5300
  },
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'naive-ui': ['naive-ui'],
          'echarts': ['echarts', 'vue-echarts']
        }
      }
    },
    // 压缩选项
    minify: 'terser',
    terserOptions: {
      compress: {
        // 移除 console
        drop_console: true,
        // 移除 debugger
        drop_debugger: true
      }
    },
    // 启用 gzip 压缩
    reportCompressedSize: true,
    // CSS 代码分割
    cssCodeSplit: true,
    // 资源文件大小限制
    assetsInlineLimit: 4096
  }
})
