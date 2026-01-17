import path from "path"
import vueJSX from '@vitejs/plugin-vue-jsx'
import type { UserConfig } from "vitepress"
import { MarkdownTransform } from "../plugins/markdown-transform"

type ViteConfig = Required<UserConfig>['vite']
type ResolveOptions = Required<ViteConfig>['resolve']
type AliasOptions = Required<ResolveOptions>['alias']

const alias: AliasOptions = [
    {
        find: '~/',
        replacement: `${path.resolve(__dirname, '../vitepress')}/`
    },
]

function getVite() {
    return {
        resolve: {
            alias
        },
        ssr: {
            noExternal: ['naive-ui', 'date-fns', 'vueuc']
        },
        plugins: [
            vueJSX(),
            MarkdownTransform()
        ]
    } as ViteConfig
}

export const vite = getVite()
