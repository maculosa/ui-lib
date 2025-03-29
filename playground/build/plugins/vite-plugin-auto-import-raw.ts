import type { Plugin } from 'vite'

export function autoImportRaw(): Plugin {
  return {
    name: 'vite-plugin-auto-import-raw',
    transform(code, id) {
      if (!id.endsWith('.md')) return

      const importRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"](?!\?raw)/g
      const matches = Array.from(code.matchAll(importRegex))

      let modifiedCode = code
      
      matches.forEach(match => {
        const [fullMatch, importName, importPath] = match
        if (importPath.endsWith('.vue')) {
          const rawImportName = `${importName}Raw`
          const rawImportPath = `${importPath}?raw`
          
          // 检查是否已经导入了 raw 版本
          const hasRawImport = code.includes(`${rawImportPath}`)
          if (!hasRawImport) {
            // 在原始导入后添加 raw 导入

            const rawImport = `import ${rawImportName} from '${rawImportPath}'`
            modifiedCode = modifiedCode.replace(
              fullMatch,
              `${fullMatch}\n${rawImport}`
            )
          }
        }
      })

      if (modifiedCode !== code) {
        return {
          code: modifiedCode,
          map: null
        }
      }
    }
  }
}