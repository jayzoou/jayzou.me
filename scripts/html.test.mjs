import assert from 'node:assert/strict'
import test from 'node:test'
import { enrichHead } from './lib/html.mjs'

const metadata = { title: 'A < B & "C"', description: 'Read "quoted" <code>', canonical: 'https://jayzou.me/posts/topic/', noindex: true }

test('metadata escapes text while leaving React body byte-for-byte intact', () => {
  const body = '<body><!--react--><main><title>Do not edit</title><meta name="description" content="Example"></main></body>'
  const html = enrichHead(`<head><title>Old</title></head>${body}`, metadata)
  assert.ok(html.endsWith(body))
  assert.match(html, /A &lt; B &amp; &quot;C&quot;/)
  assert.match(html, /Read &quot;quoted&quot; &lt;code&gt;/)
  assert.match(html, /content="noindex"/)
})

test('repeated enrichment replaces head tags and removes obsolete noindex', () => {
  const original = '<head><title>Old</title></head><body>Content</body>'
  const once = enrichHead(original, metadata)
  const twice = enrichHead(once, metadata)
  assert.equal((twice.match(/name="description"/g) || []).length, 1)
  assert.equal((twice.match(/rel="canonical"/g) || []).length, 1)
  assert.ok(!enrichHead(twice, { ...metadata, noindex: false }).includes('name="robots"'))
})
