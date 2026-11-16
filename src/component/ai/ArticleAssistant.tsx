import { lazy, Suspense, useState } from 'react'

const ArticleInsight = lazy(() => import('./ArticleInsight'))
const ArticleAssistant = ({ articlePath }: { articlePath: string }) => {
  const [open, setOpen] = useState(false)
  return <aside className="article-assistant" aria-label="文章 AI 导读">
    <div className="article-assistant-bar"><span>✦ 读前导览 <small>演示功能</small></span><button type="button" onClick={() => setOpen(value => !value)}>{open ? '收起导读' : 'AI 速读 / 生成脑图'}</button></div>
    {open && <Suspense fallback={<p role="status">正在加载导读工具…</p>}><ArticleInsight articlePath={articlePath} /></Suspense>}
  </aside>
}
export default ArticleAssistant
