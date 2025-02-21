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
// import LightningCSS from 'unplugin-lightningcss/vite'
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
    }),
    // LightningCSS(),
    Unocss(),
    VueRouter({
      extensions: ['.vue', '.md'],
      // extendRoute(route) {
      //   // transform kebab-case to camelCase
      //   route.params.forEach((param) => {
      //     param.paramName = param.paramName.replace(/-([a-z])/g, (g) =>
      //       g[1].toUpperCase()
      //     )
      //   })

      //   // example of deleting routes
      //   // if (route.name.startsWith('/users')) {
      //   //   route.delete()
      //   // }

      //   if (route.name === '/[name]') {
      //     route.addAlias('/hello-vite-:name')
      //   }

      //   // if (route.name === '/deep/nesting') {
      //   //   const children = [...route]
      //   //   children.forEach((child) => {
      //   //     // TODO: remove one node while copying the children to its parent
      //   //   })
      //   // }

      //   // example moving a route (without tis children to the root)
      //   // if (route.fullPath.startsWith('/procomponent')) {
      //   //   route.parent!.insert(
      //   //     '/procomponent',
      //   //     route.components.get('default')!
      //   //   )
      //   // }
      // },
      routesFolder: [
        { src: 'src/pages' },
        {
          src:'src/docs',
          extensions: ['.md'],
        }
      ],
      dts: 'types/typed-router.d.ts',
      exclude: [
        '**/__*',
        '**/components/*.vue',
        '**/*.component.vue',
      ],
      importMode: 'async',
      routeBlockLang: 'yaml',
      
    }),
    Layouts(),
    Inspect(),
    Icons({
      compiler: 'vue3',
      autoInstall: true,
      customCollections: {
        // 'bm-icon': {
        //   logo: () => fs.readFile('./src/assets/icons/vue.svg', 'utf-8')
        // }
        'bm-icon': FileSystemIconLoader(
          './src/assets/icons',
          svg => svg.replace(/^<svg /, '<svg fill="currentColor" ')
        )
      }
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
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
  }
})
