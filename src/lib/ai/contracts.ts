// Generated from jayzou-api/src/contracts.ts. Run export:contracts to update.
import { z } from 'zod'
import type { UIMessage } from 'ai'

export const contractVersion = '1' as const
const text = z.string().trim().min(1).max(4000)
const localPath = z.string().regex(/^\/posts\/[\w/-]+\/$/)
export const sectionSchema = z.enum(['overview', 'skills', 'experience', 'education', 'projects'])
export const sourceSchema = z.object({
  path: localPath,
  title: text,
  description: z.string().max(4000),
  anchor: z.string().regex(/^[\w-]*$/),
  excerpt: z.string().max(1200),
})
export const profileSchema = z.object({
  name: text,
  intro: text,
  skills: z.array(text).max(50),
  experience: z.array(text).max(30),
  education: z.array(text).max(20),
  projects: z.array(text).max(30),
  links: z.array(z.object({ label: text, url: z.url().regex(/^https:\/\//) })).max(10),
})
export const knowledgeSchema = z.object({
  version: z.string().min(1),
  articles: z.array(z.object({
    path: localPath, title: text, description: z.string().max(4000), category: text,
    sections: z.array(z.object({ anchor: z.string().regex(/^[\w-]*$/), heading: text, text: z.string().max(30000) })),
  })),
})
export const insightSchema = z.object({
  articlePath: localPath,
  contentVersion: text,
  points: z.tuple([text, text, text]),
  nodes: z.array(z.object({ id: z.string().regex(/^n\d+$/), label: z.string().max(120), parentId: z.string().regex(/^n\d+$/).nullable() })).min(1).max(12),
  sources: z.array(sourceSchema).max(5),
  simulated: z.boolean(),
}).superRefine((value, context) => {
  const parents = new Map(value.nodes.map(node => [node.id, node.parentId]))
  if (parents.size !== value.nodes.length || value.nodes.filter(node => node.parentId === null).length !== 1) {
    context.addIssue({ code: 'custom', message: 'Mindmap must have unique nodes and one root' })
    return
  }
  for (const node of value.nodes) {
    const seen = new Set<string>()
    let id: string | null = node.id
    while (id !== null) {
      if (seen.has(id) || !parents.has(id)) { context.addIssue({ code: 'custom', message: 'Mindmap contains a cycle or missing parent' }); return }
      seen.add(id)
      id = parents.get(id) ?? null
    }
  }
})
export const artifactSchema = z.object({
  id: z.literal('debounce'), title: text, simulated: z.literal(true),
  files: z.object({ '/App.tsx': z.string().max(20000), '/styles.css': z.string().max(5000) }),
})
export const contactSchema = z.object({
  name: z.string().trim().min(1).max(80), email: z.email().max(254),
  message: z.string().trim().min(5).max(2000),
})
export const resumeResultSchema = z.object({ section: sectionSchema, profile: profileSchema, simulated: z.boolean() })
export const recommendationsSchema = z.object({ articles: z.array(sourceSchema).max(5), simulated: z.boolean() })
export const contactFormSchema = z.object({ title: text, simulated: z.literal(true) })

export type Source = z.infer<typeof sourceSchema>
export type Profile = z.infer<typeof profileSchema>
export type Knowledge = z.infer<typeof knowledgeSchema>
export type Insight = z.infer<typeof insightSchema>
export type Artifact = z.infer<typeof artifactSchema>
export type Section = z.infer<typeof sectionSchema>
export type PortfolioTools = {
  showResumeSection: { input: { section: Section }; output: z.infer<typeof resumeResultSchema> }
  recommendArticles: { input: { query: string }; output: z.infer<typeof recommendationsSchema> }
  openInteractiveDemo: { input: { topic: string }; output: Artifact }
  sendOfferOrMessage: { input: Record<string, never>; output: z.infer<typeof contactFormSchema> }
}
export type PortfolioMessage = UIMessage<
  { simulated: boolean; contractVersion: string },
  { insight: Insight; progress: { label: string } },
  PortfolioTools
>
