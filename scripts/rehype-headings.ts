import type { Root } from 'hast'
import { visit } from 'unist-util-visit'

// Keep existing explicit IDs, and generate the same stable IDs previously used by TOC.
export default function rehypeHeadings() {
  return (tree: Root) => {
    const used = new Set<string>()
    visit(tree, 'element', node => {
      if (node.properties.id) used.add(String(node.properties.id))
    })
    let index = 0
    visit(tree, 'element', node => {
      if (!['h1', 'h2', 'h3'].includes(node.tagName)) return
      const base = `heading-${index++}`
      if (node.properties.id) return
      let id = base
      let suffix = 1
      while (used.has(id)) id = `${base}-${suffix++}`
      used.add(id)
      node.properties.id = id
    })
  }
}
