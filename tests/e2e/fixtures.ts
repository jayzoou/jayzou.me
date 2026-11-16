import { test as base, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { createUIMessageStreamResponse, type UIMessageChunk } from 'ai'
import { z } from 'zod'
import { knowledgeSchema } from '../../src/lib/ai/contracts'

const requestSchema = z.object({ messages: z.array(z.object({ parts: z.array(z.object({ type: z.string(), text: z.string().optional() }).passthrough()) })).optional(), articlePath: z.string().optional() })

// Contract fixtures exercise UI independently; E2E_REAL_API=1 uses the separate backend.
async function fixtureResponse(pathname: string, body: unknown) {
  if (pathname === '/api/contact') return { contentType: 'application/json', status: 202, body: JSON.stringify({ simulated: true, status: 'simulated', id: 'fixture-contact' }) }
  const input = requestSchema.parse(body)
  const knowledge = knowledgeSchema.parse(JSON.parse(readFileSync('dist/ai/knowledge.json', 'utf8')))
  const article = knowledge.articles.find(item => pathname.endsWith('/insights') ? item.path.replace(/\/$/, '') === input.articlePath?.replace(/\/$/, '') : item.path.includes('/closure/'))
  if (!article) throw new Error('Fixture requires a published article')
  const source = { path: article.path, title: article.title, description: article.description, anchor: article.sections[0]?.anchor || '', excerpt: article.sections[0]?.text.slice(0, 180) || article.description }
  const events: UIMessageChunk[] = [{ type: 'start', messageId: 'fixture-answer', messageMetadata: { simulated: true, contractVersion: '1' } }]
  const text = input.messages?.at(-1)?.parts.map(part => part.text || '').join('') || ''
  const tool = (toolName: string, input: unknown, output: unknown) => events.push({ type: 'tool-input-available', toolCallId: 'fixture-tool', toolName, input }, { type: 'tool-output-available', toolCallId: 'fixture-tool', output })
  if (pathname.endsWith('/insights')) {
    events.push({ type: 'data-insight', data: { articlePath: article.path, contentVersion: knowledge.version, simulated: true, points: ['闭包保留词法作用域。', '闭包可以封装私有状态。', '具体示例请阅读原文。'], nodes: [{ id: 'n0', label: article.title, parentId: null }, { id: 'n1', label: '词法作用域', parentId: 'n0' }], sources: [source] } })
  } else {
    events.push({ type: 'text-start', id: 'fixture-text' }, { type: 'text-delta', id: 'fixture-text', delta: '以下内容来自公开资料与站内文章，当前为演示回复。' }, { type: 'text-end', id: 'fixture-text' })
    if (/联系/.test(text)) tool('sendOfferOrMessage', {}, { title: '联系 Jay', simulated: true })
    else if (/防抖|Demo/.test(text)) tool('openInteractiveDemo', { topic: text }, { id: 'debounce', title: '防抖搜索组件', simulated: true, files: { '/App.tsx': 'export default function App() { return <h1>防抖示例</h1> }', '/styles.css': 'body { color: white }' } })
    else if (/介绍|技能|简历/.test(text)) tool('showResumeSection', { section: 'overview' }, { section: 'overview', simulated: true, profile: { name: 'Jay Zou', intro: '个人学习笔记与交互演示站点。工作、教育经历和技能履历尚未配置。', skills: [], experience: [], education: [], projects: [], links: [{ label: 'GitHub', url: 'https://github.com/jayzoou' }] } })
    else tool('recommendArticles', { query: text }, { articles: [source], simulated: true })
  }
  events.push({ type: 'finish', finishReason: 'stop' })
  const response = createUIMessageStreamResponse({ stream: new ReadableStream({ start(controller) { for (const event of events) controller.enqueue(event); controller.close() } }) })
  const headers: Record<string, string> = {}
  response.headers.forEach((value, key) => { headers[key] = value })
  return { status: 200, headers, body: await response.text() }
}

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
    if (!process.env.E2E_REAL_API) await page.route('**/api/**', async route => {
      await route.fulfill(await fixtureResponse(new URL(route.request().url()).pathname, route.request().postDataJSON()))
    })
    await use()
    if (errors.length) {
      await testInfo.attach('browser-errors', { body: errors.join('\n'), contentType: 'text/plain' })
    }
    expect(errors, 'browser errors, hydration errors, and missing local resources').toEqual([])
  }, { auto: true }],
})

export { expect }
