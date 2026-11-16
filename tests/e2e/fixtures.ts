import { test as base, expect } from '@playwright/test'

// Keep model downloads and inference outside smoke tests; the UI still loads,
// awaits ready, classifies the default image, and accepts uploaded files.
const modelModule = `export async function createImageClassifier() {
  await new Promise(resolve => setTimeout(resolve, 30))
  return {
    async classify() { return [{label: 'Smoke test cat', confidence: 0.99}] }
  }
}`

export const test = base.extend<{ browserDiagnostics: void }>({
  browserDiagnostics: [async ({ page }, use, testInfo) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(`pageerror: ${error.message}`))
    page.on('console', message => {
      if (message.type() === 'error') errors.push(`console: ${message.text()}`)
    })
    page.on('response', response => {
      if (new URL(response.url()).origin === 'http://127.0.0.1:4173' && response.status() >= 400) {
        errors.push(`HTTP ${response.status()}: ${response.url()}`)
      }
    })
    await page.route(/\/assets\/imageClassifier-[\w-]+\.js$/, route => route.fulfill({ contentType: 'application/javascript', body: modelModule }))
    await use()
    if (errors.length) {
      await testInfo.attach('browser-errors', { body: errors.join('\n'), contentType: 'text/plain' })
    }
    expect(errors, 'browser errors, hydration errors, and missing local resources').toEqual([])
  }, { auto: true }],
})

export { expect }
