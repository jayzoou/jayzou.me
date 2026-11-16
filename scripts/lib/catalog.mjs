import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { normalizeRoute, pagePathToRoute } from '../../src/lib/pageRoutes.ts'

export function auditCatalog({ root, categories }) {
  const errors = []
  const ids = new Set()
  const categoryPaths = new Set()
  const articles = new Map()
  for (const category of categories) {
    if (!category.id || ids.has(category.id)) errors.push(`catalog: missing or duplicate category id ${category.id}`)
    ids.add(category.id)
    if (!category.path?.startsWith('/posts/') || categoryPaths.has(normalizeRoute(category.path))) errors.push(`catalog: invalid or duplicate category path ${category.path}`)
    categoryPaths.add(normalizeRoute(category.path))
    if (!category.label?.trim() || !['blog', 'english'].includes(category.section)) errors.push(`catalog: invalid category ${category.id}`)
    if (!existsSync(path.join(root, `pages${category.path}/Index.mdx`))) errors.push(`catalog: category ${category.id} has no index page`)
    for (const article of category.articles) {
      const route = normalizeRoute(article.path)
      if (!/^\/posts\/[\w/-]+$/.test(article.path) || articles.has(route)) errors.push(`catalog: invalid or duplicate article path ${article.path}`)
      if (!article.title?.trim() || !article.description?.trim()) errors.push(`catalog: ${route} needs a title and description`)
      if (!['published', 'planned', 'reserved'].includes(article.status)) errors.push(`catalog: invalid status for ${route}`)
      if (article.status === 'reserved' && !article.reason?.trim()) errors.push(`catalog: reserved page ${route} needs a reason`)
      const source = path.join(root, `pages${article.path}.mdx`)
      if (article.status !== 'planned' && !existsSync(source)) errors.push(`catalog: ${route} has no MDX source`)
      if (article.status === 'published' && existsSync(source) && !readFileSync(source, 'utf8').trim()) errors.push(`catalog: published article ${route} is empty`)
      if (article.status === 'planned' && existsSync(source)) errors.push(`catalog: planned article ${route} already has an MDX source; publish it or remove the source`)
      articles.set(route, article)
    }
  }
  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name)
      if (entry.isDirectory()) visit(file)
      else if (entry.name.endsWith('.mdx') && entry.name !== 'Index.mdx') {
        const relative = path.relative(root, file).split(path.sep).join('/')
        if (!articles.has(normalizeRoute(pagePathToRoute(relative)))) errors.push(`${relative}: missing catalog metadata`)
      }
    }
  }
  visit(path.join(root, 'pages/posts'))
  return errors
}
