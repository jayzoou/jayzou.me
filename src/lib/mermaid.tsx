import { useEffect } from 'react'

export function MermaidInit() {
  useEffect(() => {
    let cancelled = false
    void (async () => {
      const { default: mermaid } = await import('mermaid')
      mermaid.initialize({ startOnLoad: false })
      if (!cancelled) await mermaid.run({ nodes: document.querySelectorAll('.mermaid') })
    })().catch(error => console.error('Mermaid rendering failed:', error))
    return () => { cancelled = true }
  }, [])
  return null
}
