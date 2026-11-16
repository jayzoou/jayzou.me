import { useEffect } from 'react'
import mermaid from 'mermaid'

// Disable Mermaid's window-load handler before it can mutate server HTML.
// Rendering starts from an Effect after React has hydrated the article.
mermaid.initialize({ startOnLoad: false })

export function MermaidInit() {
  useEffect(() => {
    void mermaid.run({ nodes: document.querySelectorAll('.mermaid') }).catch(error => {
      console.error('Mermaid rendering failed:', error)
    })
  }, [])
  return null
}
