import { useEffect } from 'react'
import mermaid from 'mermaid'

export function MermaidInit() {
  useEffect(() => {
    try {
      mermaid.initialize({ startOnLoad: false })
      mermaid.init(undefined, document.querySelectorAll('.mermaid'))
    } catch (e) {
      // silently fail if mermaid cannot render
    }
  }, [])
  return null
}
