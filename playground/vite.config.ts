import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJSX from '@vitejs/plugin-vue-jsx'
// import VueRouter from 'unplugin-vue-router/vite'
import Inspect from 'vite-plugin-inspect'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import Markdown from 'unplugin-vue-markdown/vite'
import Pages from 'vite-plugin-pages'
// import prism from 'markdown-it-prism'
import { full as emoji } from 'markdown-it-emoji'
import LightningCSS from 'unplugin-lightningcss/vite'
import hljs from 'highlight.js'
// import highlightjsIt from 'markdown-it-highlightjs'
import markdownItAttrs from 'markdown-it-attrs'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItTOC from 'markdown-it-toc-done-right'
import uslug from 'uslug'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  plugins: [
    // VueRouter({
    //   extensions: ['.vue', '.md'],
    //   routesFolder: [
    //     'src/pages',
    //     {
    //       src: 'src/docs',
    //       extensions: ['.md'],
    //     }
    //   ],
    //   dts: 'types/typed-router.d.ts'
    // }),
    vue({
      include: [/\.vue$/, /\.md$/], // <-- allows Vue to compile markdown files
    }),
    vueJSX(),
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
          permalink: true,
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
    }),
    LightningCSS(),
    Pages({
      pagesDir: [
        { dir: 'src/pages', baseRoute: '' },
        { dir: 'src/docs', baseRoute: 'docs' },
      ],
      extensions: ['vue', 'md']
    }),
    Inspect(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        VueRouterAutoImports,
      ],
      dts: 'types/auto-imports.d.ts'
    }),
    Components({
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [NaiveUiResolver()],
      dts: 'types/components.d.ts',
    }),
  ],
  server: {
    port: 5300
  }
})
