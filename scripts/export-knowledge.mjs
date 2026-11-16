import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { categories } from '../src/content/catalog.ts'
import { extractSections, knowledgeVersion } from './lib/knowledge.mjs'

const root = new URL('../dist/', import.meta.url)
const articles = await Promise.all(categories.flatMap(category => category.articles.filter(article => article.status === 'published').map(async article => ({
  path: `${article.path}/`, title: article.title, description: article.description, category: category.label,
  sections: extractSections(await readFile(new URL(`.${article.path}/index.html`, root), 'utf8'), article.title),
}))))
const knowledge = { version: knowledgeVersion(articles), articles }
await mkdir(new URL('ai/', root), { recursive: true })
await writeFile(new URL('ai/knowledge.json', root), JSON.stringify(knowledge))
console.log(`Exported ${articles.length} published articles for AI (${knowledge.version})`)
