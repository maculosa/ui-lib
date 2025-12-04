import camelCase from 'camelcase';
import type { Plugin } from 'vite'
import container from 'markdown-it-container'
import MarkdownIt from 'markdown-it'
import fs from 'fs'
import path from 'path'

function parseParams(params: string): [string, string] {
  try {
    // 移除方括号并分割参数
    const content = params.replace(/^\[|\]$/g, '').trim()
    const [title = '', description = ''] = content.split(',').map(s => s.trim())
    return [title, description]
  } catch (e) {
    return ['', '']
  }
}

export function demoContainer(): Plugin {
  const mdIt = new MarkdownIt()

  return {
    name: 'vite-plugin-md-demo',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('.md')) return

      mdIt.use(container, 'demo', {
        validate(params: any) {
          return params.trim().match(/^\:\:\:demo\s*(.*)$/)
        },
        render(tokens: any[], idx: number) {
          const token = tokens[idx]
          const info = token.info.trim().match(/^\:\:\:demo\s*(.*)$/)

          if (token.nesting === 1) {
            const [title, description] = parseParams(info?.[1] || '')

            const demoPath = tokens[idx + 2].content.trim()
            const componentName = camelCase(demoPath.replace(/\//g, '-'), {
              pascalCase: true
            })
            
            return `
            <script setup>
              import ${componentName} from '/src/examples/${demoPath}.vue'
              import ${componentName}Raw from '/src/examples/${demoPath}.vue?raw'
            </script>
            <UiDemo
              title="${title}"
              description="${description}"
              :raw="${componentName}Raw"
            >
              <${componentName} />  
            `
          } else {
            return '</UiDemo>'
          }
        }
      })

      const result = mdIt.render(code)
      return {
        code: result,
        map: null
      }
    }
  }
}
