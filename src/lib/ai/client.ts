import { DefaultChatTransport } from 'ai'
import { z } from 'zod'
import { artifactSchema, contactFormSchema, insightSchema, recommendationsSchema, resumeResultSchema, sectionSchema } from './contracts'
import type { PortfolioMessage } from './contracts'

export function apiUrl(path: string) {
  return `${(import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')}${path}`
}
export const messageSchemas = {
  metadataSchema: z.object({ simulated: z.boolean(), contractVersion: z.string() }).optional(),
  dataSchemas: { insight: insightSchema, progress: z.object({ label: z.string() }) },
  tools: {
    showResumeSection: { inputSchema: z.object({ section: sectionSchema }), outputSchema: resumeResultSchema },
    recommendArticles: { inputSchema: z.object({ query: z.string() }), outputSchema: recommendationsSchema },
    openInteractiveDemo: { inputSchema: z.object({ topic: z.string() }), outputSchema: artifactSchema },
    sendOfferOrMessage: { inputSchema: z.object({}), outputSchema: contactFormSchema },
  },
}
export function createChatTransport(api = '/api/chat', body: Record<string, string> = {}) {
  return new DefaultChatTransport<PortfolioMessage>({
    api: apiUrl(api), body: { contractVersion: '1', ...body },
    prepareSendMessagesRequest: ({ messages, id, trigger, messageId, body }) => {
      const recent = messages.slice(-20)
      const start = recent.findIndex(message => message.role === 'user')
      return { body: { ...body, id, trigger, messageId, messages: recent.slice(Math.max(start, 0)) } }
    },
  })
}
