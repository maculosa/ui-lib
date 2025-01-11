import { camelize } from '@vue/shared';
import type { Plugin } from 'vite'
import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'

const docRoot = path.resolve(__dirname, '../../../docs')

type Append = Record<'headers' | 'footers' | 'scriptSetups', string[]>

interface MarkdownTransformOption {
    docDir?: string
}

let compPaths: string[]
export function MarkdownTransform({
    docDir
}: MarkdownTransformOption = {
    docDir: './'
}): Plugin {
    return {
        name: 'vite-plugin-vue-md-transform',
        enforce: 'pre',
        async buildStart() {
            const pattern = `/component`

            compPaths = await glob(pattern, {
                cwd: docRoot,
                absolute: true,
                onlyDirectories: true
            })
        },
        async transform(code, id) {
            if (!id.endsWith('.md')) return

            // 获取组件模块 id
            const packageId = path.relative(docRoot, id).split('/')[0]
            const componentId = path.basename(id, '.md')
            const append: Append = {
                headers: [],
                footers: [],
                scriptSetups: getExampleImports(packageId, componentId)
            }

            code = transformVpScriptSetup(code, append)

            console.log({ compPaths })
            if (compPaths.some((compPath) => id.startsWith(compPath))) {
                console.log('startsWith--------')
            //     // code = transformComponentMarkdown(id, componentId, code, append)
            }

            const resMd = combineMarkdown(
                code,
                [combineScriptSetup(append.scriptSetups), ...append.headers],
                append.footers
            )
            console.log({ resMd })
            return resMd
        }
    }
}

const combineScriptSetup = (codes: string[]) => {
    if (codes.length === 0) return ''
    return `\n<script setup>
    ${codes.join('\n')}
    </script>
    `
}


const combineMarkdown = (
    code: string,
    headers: string[],
    footers: string[]
) => {
    const frontmatterEnds = code.indexOf('---\n\n')
    const firstHeader = code.search(/\n#{1,6}\s.+/)
    const sliceIndex =
        firstHeader < 0
            ? frontmatterEnds < 0
                ? 0
                : frontmatterEnds + 4
            : firstHeader

    if (headers.length > 0) {
        code = code.slice(0, sliceIndex) + headers.join('\n') + code.slice(sliceIndex)
    }

    code += footers.join('\n')

    return `${code}\n`
}

const vpScriptSetupRE = /<vp-script\s(.*\s)?setup(\s.*)?>([\s\S]*)<\/vp-script>/

const transformVpScriptSetup = (code: string, append: Append) => {
    const matches = code.match(vpScriptSetupRE)
    if (matches) code = code.replace(matches[0], '')
    const scriptSetup = matches?.[3] ?? ''
    if (scriptSetup) append.scriptSetups.push(scriptSetup)
    return code
}

const transformComponentMarkdown = (
    id: string,
    componentId: string,
    packageId: string,
    code: string,
    append: Append
) => {

}


const getExampleImports = (packageId: string, componentId: string) => {
    const examplePath = path.resolve(docRoot, 'examples', packageId, componentId)
    if (!fs.existsSync(examplePath)) return []
    const files = fs.readdirSync(examplePath)
    const imports: string[] = []

    for (const item of files) {
        if (!/\.vue$/.test(item)) continue
        const file = item.replace(/\.vue$/, '')
        const name = camelize(`Ep-${packageId}-${componentId}-${file}`)

        imports.push(
            `import ${name} from '../examples/${packageId}/${componentId}/${file}.vue'`
        )
    }

    return imports
}