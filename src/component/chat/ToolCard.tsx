import type { Artifact, PortfolioMessage } from '../../lib/ai/contracts'
import { artifactSchema, recommendationsSchema, resumeResultSchema, contactFormSchema } from '../../lib/ai/contracts'
import ContactForm from './ContactForm'

const labels = { overview: '公开简介', skills: '技能栈', experience: '工作经历', education: '教育经历', projects: '项目经历' }

const ToolCard = ({ part, onArtifact }: { part: PortfolioMessage['parts'][number]; onArtifact: (artifact: Artifact) => void }) => {
  if (!('state' in part) || !part.type.startsWith('tool-')) return null
  if (part.state === 'output-error') return <p role="status">工具执行失败，可以重试回复。</p>
  if (part.state !== 'output-available' || !('output' in part)) return <p className="chat-muted" role="status">正在准备内容…</p>
  switch (part.type) {
    case 'tool-showResumeSection': {
      const result = resumeResultSchema.safeParse(part.output)
      if (!result.success) break
      const { section, profile } = result.data
      const items = section === 'overview' ? [] : profile[section]
      return <section className="ai-card" aria-label={labels[section]}>
        <strong>{profile.name} · {labels[section]}</strong>
        {section === 'overview' ? <p>{profile.intro}</p> : items.length ? <ul>{items.map(item => <li key={item}>{item}</li>)}</ul> : <p>这部分履历尚未配置，暂时无法提供具体信息。</p>}
        <div className="ai-card-links">{profile.links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}</div>
      </section>
    }
    case 'tool-recommendArticles': {
      const result = recommendationsSchema.safeParse(part.output)
      if (!result.success) break
      return <div className="ai-article-list" aria-label="推荐文章">{result.data.articles.map(article => <article className="ai-card" key={article.path}>
        <a href={`${article.path}${article.anchor ? `#${article.anchor}` : ''}`}>{article.title} ↗</a>
        <p>{article.description}</p><blockquote>{article.excerpt}</blockquote>
      </article>)}</div>
    }
    case 'tool-openInteractiveDemo': {
      const result = artifactSchema.safeParse(part.output)
      if (!result.success) break
      return <div className="ai-card"><strong>{result.data.title}</strong><p>预设 React 示例 · 可以编辑与运行</p><button type="button" onClick={() => onArtifact(result.data)}>打开 Demo</button></div>
    }
    case 'tool-sendOfferOrMessage':
      if (contactFormSchema.safeParse(part.output).success) return <ContactForm />
  }
  return <p role="status">返回内容不符合接口约定，请重试。</p>
}
export default ToolCard
