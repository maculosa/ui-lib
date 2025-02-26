import camelCase from 'camelcase';
import type { Plugin } from 'vite'
import { parse } from '@vue/compiler-sfc'
import * as fs from 'fs'
import * as path from 'path'
import glob from 'fast-glob'

export function markdownComponentImports(): Plugin {
  return {
    name: 'vite-plugin-md-component-imports',
    transform(code, id) {
      if (!id.endsWith('.md')) return

      const examplesDir = path.resolve(process.cwd(), 'src/examples')
      const mdDir = path.dirname(id)
      const mdName = path.basename(id, '.md')
      
      // 查找对应目录下的所有示例组件
      const demoFiles = glob.sync(`${examplesDir}/${mdName}/**/*.vue`)
      
      if (demoFiles.length === 0) return

      // 生成导入语句
      const imports = demoFiles.map(file => {
        const relativePath = path.relative(mdDir, file)
        const componentName = camelCase(path.basename(file, '.vue').replaceAll('/', '-'), {
          pascalCase: true
        })
        console.log({ componentName })
        return `import ${componentName} from '${relativePath}'
import ${componentName}Raw from '${relativePath}?raw'`
      }).join('\n')

      // 在 setup 标签后插入导入语句
      const setupRegex = /(<script\s*setup[^>]*>)/
      const result = code.replace(setupRegex, `$1\n${imports}\n`)

      return {
        code: result,
        map: null
      }
    }
  }
}