import type { MarkdownRenderer } from "vitepress";
import fs from 'node:fs'
import path from 'node:path'
import camelCase from 'camelcase'

const docRoot = path.resolve(__dirname, '../../../docs')

interface ContainerOpts {
    marker?: string | undefined
    validate?(params: string): boolean
    render?: MarkdownRenderer['renderer']['rules']['container']
}

function transformToDecamelize(str: string) {
   return str.replaceAll('/', '-')
}
function transformToCamelCase(str: string) {
    return camelCase(transformToDecamelize(str), { pascalCase: true })
}

function createDemoContainer(md: MarkdownRenderer): ContainerOpts {
    return {
        validate(params) {
            return !!params.trim().match(/^demo\s*(.*)$/)
          },
      
          render(tokens, idx) {
            const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
            if (tokens[idx].nesting === 1 /* means the tag is opening */) {
              const description = m && m.length > 1 ? m[1] : ''
              const sourceFileToken = tokens[idx + 2]
              let source = ''
              const sourceFile = sourceFileToken.children?.[0].content ?? ''
      
              if (sourceFileToken.type === 'inline') {
                source = fs.readFileSync(
                  path.resolve(docRoot, 'examples', `${sourceFile}.vue`),
                  'utf-8'
                )
              }
              if (!source) throw new Error(`Incorrect source file: ${sourceFile}`)
      
              return `
              <Demo source="${encodeURIComponent(
                md.render(`\`\`\` vue\n${source}\`\`\``)
              )}" path="${sourceFile}" raw-source="${encodeURIComponent(
                source
              )}" description="${encodeURIComponent(md.render(description))}">
        <template #source><Ep${transformToCamelCase(sourceFile)}/></template>`
            } else {
              return '</Demo>\n'
            }
          },
    }
}

export default createDemoContainer
