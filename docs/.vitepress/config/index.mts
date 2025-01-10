import { defineConfig } from 'vitepress'
import { sidebar } from './sidebars'
import { nav } from './nav'
import { mdPlugin } from './plugins'
import { vite } from './vite'
import { vueCompiler } from './vue-compiler'

const fileAndStyles: Record<string, string> = {}

const buildTransformers = () => {
  const transformer = () => {
    return {
      props: [],
      needRuntime: true
    }
  }

  const transformers = {}
  const directives = [
    'infinite-scroll',
    'loading'
  ]

  directives.forEach(k => {
    transformers[k] = transformer
  })

  return transformers
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Banmao Vue Tools",
    description: "A VitePress Site",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav,
        sidebar: sidebar,
        socialLinks: [
            { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
        ],
    },
    markdown: {
        config: (md) => mdPlugin(md)
    },
    vue: {
      compiler: vueCompiler,
      template: {
        compilerOptions: {
          hoistStatic: false,
          isCustomElement: (tag) => {
            return tag.startsWith('Ep')
          },
          directiveTransforms: buildTransformers(),
        },
      },
    },
    vite,
    postRender(context) {
        const styleRegex = /<css-render-style>((.|\s)+)<\/css-render-style>/
        const vitepressPathRegex = /<vitepress-path>(.+)<\/vitepress-path>/
        const style = styleRegex.exec(context.content)?.[1]
        const vitepressPath = vitepressPathRegex.exec(context.content)?.[1]
        if (vitepressPath && style) {
          fileAndStyles[vitepressPath] = style
        }
        context.content = context.content.replace(styleRegex, '')
        context.content = context.content.replace(vitepressPathRegex, '')
      },
      transformHtml(code, id) {
        const html = id.split('/').pop()
        if (!html)
          return
        const style = fileAndStyles[`/${html}`]
        if (style) {
          return code.replace(/<\/head>/, `${style}</head>`)
        }
      }
})
