import path from 'node:path'
import type { Page } from '@playwright/test'
import { test, expect } from './fixtures'

async function openPage(page: Page, url: string) {
  const response = await page.goto(url)
  expect(response?.status()).toBe(200)
  await expect(page.locator('#root')).toHaveAttribute('data-hydrated', 'true')
}


test('home loads, model UI accepts an image, and primary navigation works', async ({ page }) => {
  await openPage(page, '/')
  await expect(page.getByRole('heading', { name: 'Jay Zou', exact: true })).toBeVisible()
  await expect(page.getByText('Smoke test cat — 99.00%')).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1)
  await page.getByLabel('Select the picture').setInputFiles(path.resolve('src/component/Things/img/cat.jpg'))
  await expect(page.getByText('cat.jpg', { exact: true })).toBeVisible()
  await expect(page.getByText('Smoke test cat — 99.00%')).toBeVisible()
  await page.locator('header').getByRole('link', { name: 'Blog', exact: true }).click()
  await expect(page).toHaveURL(/\/posts\/js_core\/?$/)
  await expect(page.getByRole('heading', { name: '闭包', exact: true })).toBeVisible()
  await page.locator('header').getByRole('link', { name: 'Projects', exact: true }).click()
  await expect(page).toHaveURL(/\/projects\/?$/)
  await expect(page.locator('main').getByRole('link', { name: /vite-react-static/ })).toBeVisible()
})

test('category links open articles and deep URLs survive refresh', async ({ page }) => {
  await openPage(page, '/posts/js_core/')
  await page.getByRole('link', { name: /闭包.*函数与其词法环境/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('JavaScript 闭包')
  const response = await page.reload()
  expect(response?.status()).toBe(200)
  await expect(page.locator('#root')).toHaveAttribute('data-hydrated', 'true')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('JavaScript 闭包')
})

test('article code highlights and copies; table of contents follows viewport rules', async ({ page, context, isMobile }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await openPage(page, '/posts/js_core/closure/')
  const highlighted = page.locator('main pre.shiki-done, main pre.shiki').first()
  await expect(highlighted).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1)
  const code = (await highlighted.locator('code').innerText()).trim()
  await page.bringToFront()
  await page.getByRole('button', { name: '复制代码', exact: true }).first().click()
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(code)
  await expect(page.getByRole('button', { name: '已复制!', exact: true }).first()).toBeVisible()
  const toc = page.locator('nav.toc')
  if (isMobile) {
    await expect(toc).toBeHidden()
  } else {
    await expect(toc).toBeVisible()
    const link = toc.getByRole('link', { name: '1. 为什么需要闭包？', exact: true })
    const href = await link.getAttribute('href')
    if (!href) throw new Error('Table of contents link must have a target')
    await link.click()
    await expect.poll(async () => page.locator(href).evaluate(element => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(150)
  }
})

test('math renders and grammar tables fit the mobile page', async ({ page }) => {
  await openPage(page, '/posts/linear_algebra/introduction/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('线性代数入门')
  await expect(page.locator('main .katex').first()).toBeVisible()
  await openPage(page, '/posts/english/grammar/tenses/')
  await expect(page.locator('main table.tenses-table')).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1)
})

test('Mermaid renders after loading an article directly', async ({ page }) => {
  await openPage(page, '/posts/js_core/event_loop/')
  await expect(page.locator('main .mermaid svg')).toBeVisible()
  await expect(page.locator('main img').first()).toBeVisible()
})
