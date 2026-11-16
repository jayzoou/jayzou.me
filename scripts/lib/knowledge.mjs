import { createHash } from 'node:crypto'
import { parse } from 'parse5'

function children(node) { return node.childNodes || [] }
function find(node, predicate) {
  if (predicate(node)) return node
  for (const child of children(node)) { const match = find(child, predicate); if (match) return match }
}
function attribute(node, name) { return node.attrs?.find(attr => attr.name === name)?.value }
function text(node) {
  if (['script', 'style', 'button', 'nav'].includes(node.tagName) || attribute(node, 'aria-hidden') === 'true' || attribute(node, 'class')?.split(' ').some(name => ['mermaid', 'article-assistant', 'sr-only'].includes(name))) return ''
  return node.nodeName === '#text' ? node.value : children(node).map(text).join(' ')
}

export function extractSections(html, title) {
  const main = find(parse(html), node => node.tagName === 'main')
  if (!main) throw new Error(`Missing article main: ${title}`)
  const sections = []
  let current = { heading: title, anchor: '', text: '' }
  function visit(node) {
    if (/^h[1-3]$/.test(node.tagName || '')) {
      if (current.text.trim()) sections.push(current)
      current = { heading: text(node).replace(/\s+/g, ' ').trim(), anchor: attribute(node, 'id') || '', text: '' }
      return
    }
    if (['p', 'pre', 'ul', 'ol', 'table', 'blockquote'].includes(node.tagName)) {
      current.text += ` ${text(node).replace(/\s+/g, ' ').trim()}`
      return
    }
    if (attribute(node, 'class')?.split(' ').includes('article-assistant')) return
    for (const child of children(node)) visit(child)
  }
  visit(main)
  if (current.text.trim()) sections.push(current)
  return sections.map(section => ({ ...section, text: section.text.trim().slice(0, 30000) })).filter(section => section.heading)
}

export function knowledgeVersion(articles) {
  const canonical = value => Array.isArray(value) ? value.map(canonical)
    : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value
  return createHash('sha256').update(JSON.stringify(canonical(articles))).digest('hex').slice(0, 20)
}

export function auditKnowledge(knowledge, categories, htmlForRoute) {
  const errors = []
  const expected = new Map(categories.flatMap(category => category.articles.filter(article => article.status === 'published').map(article => [`${article.path}/`, article])))
  const seen = new Set()
  for (const article of knowledge.articles) {
    const metadata = expected.get(article.path)
    if (!metadata) { errors.push(`Knowledge contains unpublished or unknown route: ${article.path}`); continue }
    if (seen.has(article.path)) errors.push(`Knowledge contains duplicate route: ${article.path}`)
    seen.add(article.path)
    if (article.title !== metadata.title || article.description !== metadata.description) errors.push(`Knowledge metadata differs from catalog: ${article.path}`)
    const tree = parse(htmlForRoute(article.path))
    if (!article.sections.length) errors.push(`Knowledge has no body sections: ${article.path}`)
    for (const section of article.sections) if (section.anchor && !find(tree, node => attribute(node, 'id') === section.anchor)) errors.push(`Knowledge has missing anchor: ${article.path}#${section.anchor}`)
  }
  for (const route of expected.keys()) if (!seen.has(route)) errors.push(`Knowledge omits published article: ${route}`)
  if (knowledge.version !== knowledgeVersion(knowledge.articles)) errors.push('Knowledge content version is stale')
  return errors
}
