import { useEffect, useState } from 'react'

interface Heading { id: string; text: string; level: number }

const TableOfContents = () => {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    // Page modules are loaded before rendering. Heading IDs already exist in the
    // static HTML; code highlighting no longer mutates the document after hydration.
    const elements = Array.from(document.querySelectorAll<HTMLElement>('main h1, main h2, main h3'))
    setHeadings(elements.map(element => ({ id: element.id, text: element.textContent || '', level: Number(element.tagName[1]) })))
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
      if (visible.length) setActiveId(visible[0].target.id)
    }, { rootMargin: '-80px 0px -80% 0px' })
    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  if (!headings.length) return null
  return <nav className="toc" aria-label="文章目录">
    <div className="toc-title">目录</div>
    <ul className="toc-list">{headings.map(heading => <li key={heading.id} className={`toc-item toc-level-${heading.level} ${activeId === heading.id ? 'active' : ''}`}>
      <a href={`#${heading.id}`} onClick={event => {
        event.preventDefault()
        document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' })
        history.replaceState(history.state, '', `#${heading.id}`)
      }}>{heading.text}</a>
    </li>)}</ul>
  </nav>
}

export default TableOfContents
