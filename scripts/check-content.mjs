import { fileURLToPath } from 'node:url'
import { auditContent } from './lib/content.mjs'
import { reservedPages } from './content-policy.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const result = auditContent({ root, reservedPages })
if (result.errors.length) {
  console.error(`Content check failed (${result.errors.length} problems):\n${result.errors.map(error => `- ${error}`).join('\n')}`)
  process.exitCode = 1
} else {
  console.log(`Content check passed: ${result.pageCount} pages, local links/assets/anchors, article discoverability (${result.reservedCount} documented reserved page).`)
}
