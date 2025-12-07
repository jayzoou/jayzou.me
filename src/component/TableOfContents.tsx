import { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'

interface Heading {
  id: string
  text: string
  level: number
}

const TableOfContents = () => {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const location = useLocation()
  const obsRef = useRef<MutationObserver | null>(null)

  useEffect(() => {
    const extractHeadings = () => {
      const article = document.querySelector('main')
      console.log('article', article)
      if (!article) return

      const elements = article.querySelectorAll('h1, h2, h3')
      const items: Heading[] = []

      elements.forEach((el, index) => {
        if (!el.id) {
          el.id = `heading-${index}`
        }
        items.push({
          id: el.id,
          text: el.textContent || '',
          level: parseInt(el.tagName[1])
        })
      })

      setHeadings(items)
    }
    // Try extracting immediately
    extractHeadings()

    // Observe the whole document body so we catch cases where <main> or its
    // children are inserted asynchronously (SSR hydration, MDX loaders, etc.).
    const mutationObserver = new MutationObserver(() => {
      extractHeadings()
    })
    obsRef.current = mutationObserver
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    // Fallback timer in case mutations don't fire quickly
    const timer = setTimeout(extractHeadings, 800)

    return () => {
      clearTimeout(timer)
      if (obsRef.current) obsRef.current.disconnect()
    }
  }, [location.pathname])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  console.log('headings', headings)

  if (headings.length === 0) return (
    <div>{headings.length}</div>
  )

  return (
    <nav className="toc">
      <div className="toc-title">目录</div>
      <ul className="toc-list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`toc-item toc-level-${heading.level} ${activeId === heading.id ? 'active' : ''}`}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault()
                handleClick(heading.id)
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TableOfContents
