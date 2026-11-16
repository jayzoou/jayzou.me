import { useEffect, useMemo } from 'react'
import { useChat } from '@ai-sdk/react'
import { createChatTransport, messageSchemas } from '../../lib/ai/client'
import { insightSchema } from '../../lib/ai/contracts'
import type { PortfolioMessage } from '../../lib/ai/contracts'
import Mindmap from './Mindmap'

const ArticleInsight = ({ articlePath }: { articlePath: string }) => {
  const transport = useMemo(() => createChatTransport('/api/articles/insights', { articlePath }), [articlePath])
  const { messages, sendMessage, stop, status, error, clearError, setMessages } = useChat<PortfolioMessage>({ transport, ...messageSchemas })
  useEffect(() => { void sendMessage({ text: '生成文章导读' }); return () => { void stop() } }, [sendMessage, stop])
  const part = messages.flatMap(message => message.parts).reverse().find(item => item.type === 'data-insight')
  const parsed = part?.type === 'data-insight' ? insightSchema.safeParse(part.data) : null
  const insight = parsed?.success ? parsed.data : null
  const busy = status === 'submitted' || status === 'streaming'
  return <div className="article-insight">
    <p className="chat-muted">从原文章节提取的模拟导读，尚未接入模型生成。</p>
    {busy && <p role="status">正在提取要点与章节结构… <button type="button" onClick={() => { void stop() }}>停止导读</button></p>}
    {error && <p role="alert">导读暂时不可用，请确认 API 服务和知识库已准备好。</p>}
    {!busy && !insight && <button type="button" onClick={() => { clearError(); setMessages([]); void sendMessage({ text: '重新生成文章导读' }) }}>重试导读</button>}
    {insight && <><strong>3 个阅读要点</strong><ol>{insight.points.map((point, index) => <li key={index}>{point}</li>)}</ol><Mindmap nodes={insight.nodes} /><p>来源：{insight.sources.map((source, index) => <a key={index} href={`${source.path}${source.anchor ? `#${source.anchor}` : ''}`}>原文片段 {index + 1} </a>)}</p></>}
  </div>
}
export default ArticleInsight
