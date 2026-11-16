import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import test from 'node:test'
import { auditCatalog } from './lib/catalog.mjs'
import rehypeHeadings from './rehype-headings.ts'

function fixture(t) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'jayzou-catalog-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  mkdirSync(path.join(root, 'pages/posts/notes'), { recursive: true })
  writeFileSync(path.join(root, 'pages/posts/notes/Index.mdx'), '# Notes')
  writeFileSync(path.join(root, 'pages/posts/notes/hello.mdx'), '# Hello')
  return root
}
const article = { path: '/posts/notes/hello', title: 'Hello', description: 'Intro', status: 'published' }
const category = { id: 'notes', path: '/posts/notes', label: 'Notes', section: 'blog', articles: [article] }

test('valid catalog covers published pages and source-free planned topics', t => {
  const root = fixture(t)
  assert.deepEqual(auditCatalog({ root, categories: [{ ...category, articles: [article, { ...article, path: '/posts/notes/future', status: 'planned' }] }] }), [])
})

test('missing, duplicated and stale metadata fail with useful diagnostics', t => {
  const root = fixture(t)
  const errors = auditCatalog({ root, categories: [{ ...category, articles: [
    { ...article, path: '/posts/notes/missing', title: '' },
    { ...article, path: '/posts/notes/missing' },
    { ...article, status: 'planned' },
    { ...article, path: '/posts/notes/reserved', status: 'reserved' },
  ] }] }).join('\n')
  assert.match(errors, /needs a title and description/)
  assert.match(errors, /duplicate article path/)
  assert.match(errors, /has no MDX source/)
  assert.match(errors, /already has an MDX source/)
  assert.match(errors, /needs a reason/)
  assert.match(auditCatalog({ root, categories: [{ ...category, articles: [] }] }).join('\n'), /missing catalog metadata/)
})

test('heading IDs are stable, preserve explicit IDs and avoid collisions', () => {
  const heading = (name, id) => ({ type: 'element', tagName: name, properties: id ? { id } : {}, children: [] })
  const tree = { type: 'root', children: [heading('h1'), heading('h2', 'heading-0'), heading('h3'), heading('h4')] }
  rehypeHeadings()(tree)
  assert.deepEqual(tree.children.map(node => node.properties.id), ['heading-0-1', 'heading-0', 'heading-2', undefined])
  rehypeHeadings()(tree)
  assert.deepEqual(tree.children.map(node => node.properties.id), ['heading-0-1', 'heading-0', 'heading-2', undefined])
})
