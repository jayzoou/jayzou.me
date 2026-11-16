import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPageMetadata } from '../src/content/catalog.ts'
import { enrichHead } from './lib/html.mjs'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
let count = 0
function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) visit(file)
    else if (entry.name === 'index.html') {
      const route = '/' + path.relative(dist, file).split(path.sep).join('/').replace(/index\.html$/, '')
      const metadata = getPageMetadata(route)
      writeFileSync(file, enrichHead(readFileSync(file, 'utf8'), metadata))
      count += 1
    }
  }
}
visit(dist)
if (!count) throw new Error('No generated HTML pages found')
console.log(`Applied catalog metadata to ${count} static pages.`)
