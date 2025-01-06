import { defineConfig } from 'vitepress'

const fileAndStyles: Record<string, string> = {}

export default defineConfig({
    title: 'UI Lib',
    description: 'A Vue.js Collection of UI Components',

    themeConfig: {

    },
    vite: {
        ssr: {
            noExternal: ['naive-ui', 'date-fns', 'vueuc']
        }
    },
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
        if (!html) return
        const style = fileAndStyles[`/${html}`]
        if (style) {
            return code.replace(/<\/head>/, `${style}</head>`)
        }
    }
})
