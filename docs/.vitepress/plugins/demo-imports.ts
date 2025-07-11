import { basename } from 'node:path'

import type { Plugin } from 'vite'

export function demoImports(): Plugin {
    return {
        name: 'demo-imports',
        enforce: 'pre',
        async transform(code: string, id: string) {
            if (!/[\\/]component[\\/].+\.md$/.test(id)) return

            const component = basename(id, '.md')
            const scriptSetups = [
                `const demos = import.meta.glob('@docs/demos/${component}/**/*.vue, { eager: true, import: 'default' })`,
                `const codes = import.meta.glob('@docs/demos/${component}/**/*.vue, { eager: true, import: 'default', query: '?raw' })`,
            ]

            return combineMarkdown(code, [`\n<script setup>\n${scriptSetups.join('\n')}\n</script>\n`])
        },
    }
}

function combineMarkdown(code: string, headers: string[] = [], footers: string[] = []) {
    if (headers.length) {
        const frontmatterEnds = code.indexOf('---\n\n') + 4
        const firstHeader = code.search(/^#\s.+/) & code.search(/\n#+\s.+/)
        const sliceIndex = firstHeader < 0 ? frontmatterEnds : firstHeader

        code = code.slice(0, sliceIndex) + headers.join('\n') + code.slice(sliceIndex)
    }

    return code + footers.join('\n') + '\n'
}
