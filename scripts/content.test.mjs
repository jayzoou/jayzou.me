import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { auditContent } from './lib/content.mjs'
import { pagePathToRoute } from '../src/lib/pageRoutes.ts'

function fixture(t, files) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'jayzou-content-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  for (const [file, value] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
    writeFileSync(path.join(root, file), value)
  }
  return root
}

const basic = {
  'pages/Index.mdx': '# Home',
  'pages/posts/topic.mdx': '# Topic',
  'dist/index.html': '<main><a href="/posts/topic?from=home#intro">Topic</a></main>',
  'dist/posts/topic/index.html': '<main><h1 id="intro">Topic</h1><img src="/assets/cat%20photo.svg" /></main>',
  'dist/assets/cat photo.svg': '<svg/>',
}

test('valid routes, query strings, anchors, encoded assets and external links', t => {
  const root = fixture(t, { ...basic, 'dist/index.html': basic['dist/index.html'] + '<a href="https://example.com/missing">External</a>' })
  assert.deepEqual(auditContent({ root }).errors, [])
  assert.equal(pagePathToRoute('../pages/Index.mdx'), '/')
  assert.equal(pagePathToRoute('pages/posts/Index.mdx'), '/posts/')
  assert.equal(pagePathToRoute('pages/posts/Indexing.mdx'), '/posts/Indexing')
})

test('reports broken links, missing assets and missing fragment targets with source paths', t => {
  const root = fixture(t, { ...basic, 'dist/posts/topic/index.html': '<main>Topic<a href="/missing">Broken</a><a href="#absent">Anchor</a><img src="/missing.svg" /></main>' })
  const errors = auditContent({ root }).errors.join('\n')
  assert.match(errors, /pages\/posts\/topic.mdx: broken href \/missing/)
  assert.match(errors, /missing anchor #absent/)
  assert.match(errors, /broken src \/missing.svg/)
})

test('detects index/article route collisions', t => {
  const root = fixture(t, { ...basic, 'pages/posts/topic/Index.mdx': '# Collision' })
  assert.ok(auditContent({ root }).errors.some(error => error.includes('duplicate route /posts/topic')))
})

test('rejects missing static output and empty article bodies', t => {
  const root = fixture(t, { ...basic, 'pages/posts/missing.mdx': '# Missing', 'dist/posts/topic/index.html': '<main> </main>' })
  const errors = auditContent({ root }).errors.join('\n')
  assert.match(errors, /missing generated HTML/)
  assert.match(errors, /no main content/)
})

test('detects undiscoverable articles and duplicate IDs', t => {
  const root = fixture(t, { ...basic, 'dist/index.html': '<main>Home</main>', 'dist/posts/topic/index.html': '<main><h1 id="same">A</h1><h2 id="same">B</h2></main>' })
  const errors = auditContent({ root }).errors.join('\n')
  assert.match(errors, /article is not linked/)
  assert.match(errors, /duplicate HTML id/)
})

test('only explicitly reserved blank pages bypass body and discoverability checks', t => {
  const root = fixture(t, { ...basic, 'pages/posts/reserved.mdx': '', 'dist/posts/reserved/index.html': '<main></main>' })
  assert.ok(auditContent({ root }).errors.some(error => error.includes('reserved.mdx')))
  const reservedPages = { 'pages/posts/reserved.mdx': 'Known blank placeholder' }
  assert.deepEqual(auditContent({ root, reservedPages }).errors, [])
  const stale = auditContent({ root, reservedPages: { 'pages/posts/topic.mdx': 'Now published', 'pages/removed.mdx': 'Gone' } }).errors.join('\n')
  assert.match(stale, /remove its reserved-page exception/)
  assert.match(stale, /exception points to a missing file/)
})

test('malformed URL escapes are diagnostics rather than crashes', t => {
  const root = fixture(t, { ...basic, 'dist/index.html': basic['dist/index.html'] + '<a href="/%ZZ">Invalid</a>' })
  assert.ok(auditContent({ root }).errors.some(error => error.includes('malformed URL encoding')))
})
