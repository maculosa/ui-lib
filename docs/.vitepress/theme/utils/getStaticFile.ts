import fs from 'node:fs'
import path from 'node:path'

export function getStaticFile(filePath: string) {
    const file = fs.readFileSync(path.resolve(filePath), 'utf8')
    return file.toString()
}
