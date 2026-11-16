import { readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const manifest = JSON.parse(readFileSync(path.join(dist, '.vite/manifest.json'), 'utf8'))
const entries = Object.keys(manifest).filter(key => manifest[key].isEntry)
const startup = new Set()
function collect(key) {
  if (startup.has(key)) return
  startup.add(key)
  for (const dependency of manifest[key].imports || []) collect(dependency)
}
entries.forEach(collect)
const gzip = file => gzipSync(readFileSync(path.join(dist, file))).length
const initialJs = [...startup].reduce((total, key) => total + gzip(manifest[key].file), 0)
const errors = []
if (initialJs > 150 * 1024) errors.push(`Initial shared JavaScript is ${(initialJs / 1024).toFixed(1)} KiB gzip (budget 150 KiB)`)
for (const [key, chunk] of Object.entries(manifest)) {
  if (key.endsWith('.mdx') && gzip(chunk.file) > 250 * 1024) errors.push(`${key} exceeds its 250 KiB gzip page budget`)
}
const css = new Set([...startup].flatMap(key => manifest[key].css || []))
const initialCss = [...css].reduce((total, file) => total + gzip(file), 0)
const knowledgeBytes = gzip('ai/knowledge.json')
// Initial full-text corpus is 139.5 KiB gzip. This server-only snapshot has its own
// 160 KiB baseline; it is excluded from browser startup and existing budgets.
if (knowledgeBytes > 160 * 1024) errors.push('AI knowledge snapshot exceeds 160 KiB gzip; split the export before increasing the budget')
if (initialCss > 20 * 1024) errors.push(`Initial CSS exceeds 20 KiB gzip`)
console.log(`Shared startup JS: ${(initialJs / 1024).toFixed(1)} KiB gzip; CSS: ${(initialCss / 1024).toFixed(1)} KiB gzip`)
console.log(`AI knowledge snapshot: ${(knowledgeBytes / 1024).toFixed(1)} KiB gzip (server import, not requested by the browser)`)
console.log(`Page modules: ${Object.keys(manifest).filter(key => key.endsWith('.mdx')).length}; entry bytes: ${entries.reduce((total, key) => total + statSync(path.join(dist, manifest[key].file)).size, 0)}`)
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1 }
