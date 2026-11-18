import { test, expect } from './fixtures'

async function home(page: import('@playwright/test').Page) {
  await page.goto('/')
  await expect(page.locator('#root')).toHaveAttribute('data-hydrated', 'true')
  await expect(page.getByRole('button', { name: '介绍一下你的技术背景' })).toBeEnabled()
}

test('resume cards restore without replaying tools, and new chat finds article sources', async ({ page }, testInfo) => {
  let requests = 0
  page.on('request', request => { if (request.url().includes('/api/chat')) requests++ })
  await home(page)
  await page.getByRole('button', { name: '介绍一下你的技术背景' }).click()
  await expect(page.getByRole('region', { name: '公开简介' })).toBeVisible()
  await expect(page.getByRole('button', { name: '停止生成' })).toHaveCount(0)
  const original = requests
  await page.reload()
  await expect(page.getByRole('region', { name: '公开简介' })).toBeVisible()
  expect(requests).toBe(original)
  await page.getByRole('button', { name: '新对话', exact: true }).click()
  await page.getByLabel('向 Jay 的助手提问').fill('有哪些关于闭包的文章？')
  await page.getByRole('button', { name: '发送' }).click()
  const source = page.getByRole('link', { name: /^闭包/ }).first()
  await expect(source).toBeVisible()
  await expect(source).toHaveAttribute('href', /\/posts\/js_core\/closure\/#heading-/)
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
  const screenshot = testInfo.outputPath('chat.png')
  await page.screenshot({ path: screenshot, fullPage: true })
  await testInfo.attach('chat-preview', { path: screenshot, contentType: 'image/png' })
  await source.click()
  await expect(page).toHaveURL(/\/posts\/js_core\/closure\/#heading-/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('JavaScript 闭包')
})

test('contact requires a user submit and reports simulated delivery', async ({ page }) => {
  await home(page)
  await page.getByRole('button', { name: '如何联系你？' }).click()
  await expect(page.getByRole('button', { name: '模拟提交', exact: true })).toBeVisible()
  await page.getByLabel('姓名', { exact: true }).fill('测试访客')
  await page.getByLabel('邮箱', { exact: true }).fill('visitor@example.com')
  await page.getByLabel('留言', { exact: true }).fill('我想进一步了解你的项目。')
  await page.getByRole('button', { name: '模拟提交', exact: true }).click()
  await expect(page.getByText('模拟提交成功，未发送邮件或机器人通知。')).toBeVisible()
})

test('artifact opens editable code on demand and restores keyboard focus', async ({ page }) => {
  const resources: string[] = []
  page.on('request', request => resources.push(request.url()))
  await home(page)
  await page.getByRole('button', { name: '写一个防抖组件 Demo' }).click()
  const open = page.getByRole('button', { name: '打开 Demo', exact: true })
  await open.click()
  await expect(page.getByRole('dialog', { name: '防抖搜索组件' })).toBeVisible()
  await expect(page.getByLabel('React 源码')).toHaveValue(/export default/)
  await page.getByLabel('React 源码').fill('export default function App() { return <h1>Hello</h1> }')
  expect(resources.filter(url => /SandboxRuntime|sandpack|codesandbox/.test(url))).toEqual([])
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(open).toBeFocused()
})

test('article insight renders three points and a scoped diagram', async ({ page }) => {
  await page.goto('/posts/js_core/closure/')
  await page.getByRole('button', { name: 'AI 速读 / 生成脑图' }).click()
  const insight = page.getByRole('complementary', { name: '文章 AI 导读' })
  await expect(insight.locator('ol > li')).toHaveCount(3)
  await expect(page.getByLabel('文章章节脑图').locator('svg')).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
  await page.getByRole('button', { name: '收起导读' }).click()
  await expect(insight.locator('ol')).toHaveCount(0)
})

test('stop discards a late response and the next conversation remains clean', async ({ page }) => {
  let release: () => void = () => {}
  const gate = new Promise<void>(resolve => { release = resolve })
  await page.route('**/api/chat', async route => {
    await gate
    await route.fulfill({ contentType: 'text/event-stream', body: 'data: {"type":"start","messageId":"late"}\n\ndata: {"type":"text-start","id":"t"}\n\ndata: {"type":"text-delta","id":"t","delta":"迟到的回复"}\n\ndata: {"type":"text-end","id":"t"}\n\ndata: {"type":"finish"}\n\ndata: [DONE]\n\n' }).catch(() => {})
  }, { times: 1 })
  await home(page)
  await page.getByLabel('向 Jay 的助手提问').fill('请介绍你的经历')
  await page.getByRole('button', { name: '发送' }).click()
  await page.getByRole('button', { name: '停止生成' }).click()
  release()
  await page.getByRole('button', { name: '新对话', exact: true }).click()
  await page.getByRole('button', { name: '有哪些关于闭包的文章？' }).click()
  await expect(page.getByRole('link', { name: /^闭包/ }).first()).toBeVisible()
  await expect(page.getByText('迟到的回复')).toHaveCount(0)
})

test('composer grows for multiline input, sends with Enter and resets focus', async ({ page }, testInfo) => {
  await home(page)
  const input = page.getByLabel('向 Jay 的助手提问')
  await expect(page.getByRole('button', { name: '发送', exact: true })).toBeDisabled()
  const initialHeight = await input.evaluate(element => element.getBoundingClientRect().height)
  await input.fill('介绍一下你的技术背景')
  for (let line = 0; line < 8; line++) await input.press('Shift+Enter')
  await expect.poll(() => input.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThan(initialHeight)
  const welcome = await page.getByText('JAY’S DIGITAL SPACE', { exact: true }).boundingBox()
  const composer = await input.boundingBox()
  expect(welcome).not.toBeNull()
  expect(composer).not.toBeNull()
  expect(welcome!.y + welcome!.height).toBeLessThan(composer!.y)
  await page.screenshot({ path: testInfo.outputPath('home-composer.png'), fullPage: true })
  await input.press('Enter')
  await expect(page.getByRole('article', { name: '你的消息' })).toHaveText('你介绍一下你的技术背景')
  await expect(page.getByRole('region', { name: '公开简介' })).toBeVisible()
  await expect(input).toHaveValue('')
  await page.getByRole('button', { name: '新对话', exact: true }).click()
  await expect(page.getByRole('button', { name: '介绍一下你的技术背景' })).toBeVisible()
  await expect(input).toBeFocused()
  await expect(input).toHaveValue('')
  await page.screenshot({ path: testInfo.outputPath('home-empty.png'), fullPage: true })
})

test('long replies scroll independently and allow returning to the latest message', async ({ page }) => {
  await page.route('**/api/chat', async route => {
    const events = [
      { type: 'start', messageId: 'long-answer' },
      { type: 'text-start', id: 'long-text' },
      { type: 'text-delta', id: 'long-text', delta: Array.from({ length: 50 }, (_, index) => `第 ${index + 1} 段：这是一段可以滚动阅读的技术笔记。`).join('\n\n') },
      { type: 'text-end', id: 'long-text' },
      { type: 'finish' },
    ]
    await route.fulfill({ headers: { 'x-vercel-ai-ui-message-stream': 'v1' }, contentType: 'text/event-stream', body: events.map(event => `data: ${JSON.stringify(event)}\n\n`).join('') + 'data: [DONE]\n\n' })
  })
  await home(page)
  await page.getByLabel('向 Jay 的助手提问').fill('阅读长笔记')
  await page.getByRole('button', { name: '发送', exact: true }).click()
  await expect(page.getByRole('button', { name: '复制回复', exact: true })).toBeVisible()
  const log = page.getByRole('log', { name: '对话记录' })
  await log.evaluate(element => { element.scrollTop = 0 })
  const latest = page.getByRole('button', { name: '回到最新消息' })
  await expect(latest).toBeVisible()
  const send = await page.getByRole('button', { name: '发送', exact: true }).boundingBox()
  expect(send).not.toBeNull()
  expect(send!.y + send!.height).toBeLessThanOrEqual(page.viewportSize()!.height)
  await latest.click()
  await expect(latest).toBeHidden()
  await expect.poll(() => log.evaluate(element => element.scrollHeight - element.scrollTop - element.clientHeight)).toBeLessThan(2)
})
