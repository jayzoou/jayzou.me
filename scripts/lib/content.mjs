import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { parse } from 'parse5'
import { pagePathToRoute } from '../../src/lib/pageRoutes.ts'

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(filename) : [filename]
  })
}

function elements(node) {
  return [node, ...(node.childNodes || []).flatMap(elements)]
}

function text(node) {
  if (['script', 'style'].includes(node.tagName)) return ''
  return node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join(' ')
}

function key(route) {
  return decodeURIComponent(route).replace(/\/index\.html$/, '').replace(/\/+$/, '') || '/'
}

export function auditContent({ root, reservedPages = {} }) {
  const errors = []
  const dist = path.join(root, 'dist')
  const pages = walk(path.join(root, 'pages')).filter(file => file.endsWith('.mdx')).sort()
  const routes = new Map()
  const documents = new Map()
  const incoming = new Set()

  for (const file of Object.keys(reservedPages)) {
    if (!existsSync(path.join(root, file))) errors.push(`${file}: reserved-page exception points to a missing file`)
    else if (readFileSync(path.join(root, file), 'utf8').trim()) errors.push(`${file}: now has content; remove its reserved-page exception`)
  }

  for (const file of pages) {
    const source = path.relative(root, file).split(path.sep).join('/')
    const route = pagePathToRoute(source)
    const routeKey = key(route)
    if (routes.has(routeKey)) errors.push(`${source}: duplicate route ${routeKey} (also ${routes.get(routeKey).source})`)
    routes.set(routeKey, { source, route, reserved: Object.hasOwn(reservedPages, source) })
    const html = path.join(dist, route, 'index.html')
    if (!existsSync(html)) {
      errors.push(`${source}: missing generated HTML ${path.relative(root, html)}; run npm run build first`)
      continue
    }
    const nodes = elements(parse(readFileSync(html, 'utf8')))
    const main = nodes.find(node => node.tagName === 'main')
    if (!main || (!text(main).trim() && !Object.hasOwn(reservedPages, source))) {
      errors.push(`${source}: generated page has no main content`)
    }
    const ids = nodes.flatMap(node => (node.attrs || []).filter(attr => attr.name === 'id').map(attr => attr.value))
    if (new Set(ids).size !== ids.length) errors.push(`${source}: duplicate HTML id`)
    documents.set(routeKey, { nodes, ids: new Set(ids) })
  }

  for (const [routeKey, document] of documents) {
    const { source, route } = routes.get(routeKey)
    // Static hosts serve each generated page from its directory URL.
    const base = new URL(route.endsWith('/') ? route : `${route}/`, 'https://jayzou.me')
    for (const node of document.nodes) {
      const attribute = node.tagName === 'a' || node.tagName === 'link' ? 'href'
        : ['img', 'script', 'source', 'video', 'audio', 'iframe'].includes(node.tagName) ? 'src' : null
      if (!attribute) continue
      const reference = node.attrs?.find(attr => attr.name === attribute)?.value
      if (!reference || /^(?:mailto:|tel:|data:|blob:)/i.test(reference)) continue
      let url
      try { url = new URL(reference, base) } catch {
        errors.push(`${source}: malformed URL ${reference}`)
        continue
      }
      if (!['http:', 'https:'].includes(url.protocol)) {
        errors.push(`${source}: unsupported URL scheme ${reference}`)
        continue
      }
      if (url.hostname !== base.hostname) continue
      let target
      try { target = key(url.pathname) } catch {
        errors.push(`${source}: malformed URL encoding ${reference}`)
        continue
      }
      if (node.tagName === 'a' && routes.has(target)) {
        if (target !== routeKey) incoming.add(target)
        if (url.hash) {
          let fragment
          try { fragment = decodeURIComponent(url.hash.slice(1)) } catch { fragment = null }
          if (!documents.get(target)?.ids.has(fragment)) errors.push(`${source}: missing anchor ${reference}`)
        }
      } else {
        const decoded = decodeURIComponent(url.pathname)
        const asset = path.resolve(dist, `.${decoded}`)
        if (!asset.startsWith(`${dist}${path.sep}`) || !existsSync(asset) || !statSync(asset).isFile()) {
          errors.push(`${source}: broken ${attribute} ${reference}`)
        }
      }
    }
  }

  for (const [routeKey, page] of routes) {
    if (page.route.startsWith('/posts/') && !page.source.endsWith('/Index.mdx') && !page.reserved && !incoming.has(routeKey)) {
      errors.push(`${page.source}: article is not linked from any other page; add it to its category list`)
    }
  }
  return { errors: [...new Set(errors)], pageCount: pages.length, reservedCount: Object.keys(reservedPages).length }
}
