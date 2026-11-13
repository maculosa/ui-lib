import camelCase from 'camelcase';
import type { Plugin } from 'vite'
// import { parse } from '@vue/compiler-sfc'
// import * as fs from 'fs'
import * as path from 'path'
import glob from 'fast-glob'

export function markdownComponentImports(): Plugin {
  return {
    name: 'vite-plugin-md-component-imports',
    transform(code, id) {
      if (!id.endsWith('.md')) return

      const examplesDir = path.resolve(process.cwd(), 'src/examples')
      const pagesDir = path.resolve(process.cwd(), 'src/pages')
      const mdDir = path.dirname(id)
      const mdName = path.basename(id, '.md')

      // 优先使用与文档同结构的嵌套示例目录（如 procomponent/watermark、blocks/login），
      // 不存在时回退到扁平目录，避免两处同名示例产生重复导入
      const relDir = path.relative(pagesDir, mdDir)
      const nestedFiles =
        relDir && relDir !== '.' && !relDir.startsWith('..')
          ? glob.sync(`${examplesDir}/${relDir}/${mdName}/**/*.vue`)
          : []
      const demoFiles = nestedFiles.length
        ? nestedFiles
        : glob.sync(`${examplesDir}/${mdName}/**/*.vue`)

      if (demoFiles.length === 0) return

      // 生成导入语句
      const imports = demoFiles.map(file => {
        const relativePath = path.relative(mdDir, file)
        const componentName = camelCase(path.basename(file, '.vue').replaceAll('/', '-'), {
          pascalCase: true
        })
        const componentNameRaw = `${componentName}Raw`
        return `import ${componentName} from '${relativePath}'
            import ${componentNameRaw} from '${relativePath}?raw'`
      }).join('\n')

      // console.log({ imports })

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