import test from 'node:test'
import assert from 'node:assert/strict'
import { auditKnowledge, extractSections, knowledgeVersion } from './lib/knowledge.mjs'

test('knowledge keeps real heading anchors and excludes UI, script and diagrams', () => {
  const sections = extractSections('<main><aside class="article-assistant"><p>AI速读</p></aside><h1 id="heading-0">正文</h1><p>保管柜保存状态</p><h2 id="explicit">例子</h2><div class="code-block"><button>复制</button><pre>  const x = 1</pre></div><div class="mermaid">graph TD</div><script>secret()</script></main>', '正文')
  assert.deepEqual(sections, [{ heading: '正文', anchor: 'heading-0', text: '保管柜保存状态' }, { heading: '例子', anchor: 'explicit', text: 'const x = 1' }])
  assert.notEqual(knowledgeVersion(sections), knowledgeVersion([...sections, { heading: '更新' }]))
})
test('knowledge export fails for missing static body', () => {
  assert.throws(() => extractSections('<div>missing</div>', '正文'), /Missing article main/)
})
test('content versions do not change when schema parsing reorders object keys', () => {
  assert.equal(knowledgeVersion([{ title: 'A', sections: [{ heading: 'H', anchor: 'h', text: '正文' }] }]), knowledgeVersion([{ sections: [{ text: '正文', anchor: 'h', heading: 'H' }], title: 'A' }]))
})
test('knowledge rejects stale versions, missing anchors, missing articles and unpublished routes', () => {
  const catalog = [{ articles: [{ path: '/posts/test/a', title: 'A', description: '摘要', status: 'published' }] }]
  const article = { path: '/posts/test/a/', title: 'A', description: '摘要', sections: [{ heading: 'A', anchor: 'missing', text: '正文' }] }
  assert.match(auditKnowledge({ version: 'stale', articles: [article] }, catalog, () => '<main id="real">正文</main>').join('\n'), /missing anchor/)
  assert.match(auditKnowledge({ version: 'stale', articles: [] }, catalog, () => '').join('\n'), /omits published article/)
  assert.match(auditKnowledge({ version: 'stale', articles: [{ ...article, path: '/posts/unpublished/' }] }, catalog, () => '').join('\n'), /unpublished or unknown/)
  assert.match(auditKnowledge({ version: 'stale', articles: [] }, [], () => '').join('\n'), /content version is stale/)
})
