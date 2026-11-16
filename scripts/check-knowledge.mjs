import { readFileSync } from 'node:fs'
import { categories } from '../src/content/catalog.ts'
import { knowledgeSchema } from '../src/lib/ai/contracts.ts'
import { auditKnowledge } from './lib/knowledge.mjs'

const dist = new URL('../dist/', import.meta.url)
const knowledge = knowledgeSchema.parse(JSON.parse(readFileSync(new URL('ai/knowledge.json', dist), 'utf8')))
const errors = auditKnowledge(knowledge, categories, route => readFileSync(new URL(`.${route}index.html`, dist), 'utf8'))
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1 }
else console.log(`Knowledge check passed: ${knowledge.articles.length} published articles, metadata, content version and source anchors.`)
