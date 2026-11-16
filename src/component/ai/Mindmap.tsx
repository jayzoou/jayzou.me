import { useEffect, useId, useRef, useState } from 'react'
import type { Insight } from '../../lib/ai/contracts'

const Mindmap = ({ nodes }: { nodes: Insight['nodes'] }) => {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId().replace(/\W/g, '')
  const [failed, setFailed] = useState(false)
  const validIds = new Set(nodes.map(node => node.id))
  const valid = validIds.size === nodes.length && nodes.filter(node => !node.parentId).length === 1 && nodes.every(node => node.parentId === null || (validIds.has(node.parentId) && node.parentId !== node.id))
  const lines = nodes.map(node => `${node.id}["${node.label.replace(/[<>"\\\r\n]/g, ' ')}"]`)
  for (const node of nodes) if (node.parentId) lines.push(`${node.parentId} --> ${node.id}`)
  const source = 'flowchart TD\n' + lines.join('\n')
  useEffect(() => {
    let cancelled = false
    const element = ref.current
    if (!valid || !element) return
    void (async () => {
      const { default: mermaid } = await import('mermaid')
      mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' })
      if (!cancelled) await mermaid.run({ nodes: [element] })
    })().catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true }
  }, [source, valid])
  if (!valid || failed) return <p role="status">脑图暂时无法显示，请参考上方要点。</p>
  return <div className="ai-mindmap" aria-label="文章章节脑图" ref={ref} id={`mindmap-${id}`}>{source}</div>
}
export default Mindmap
