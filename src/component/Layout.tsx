import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import NavBar from './NavBar.tsx'
import TableOfContents from './TableOfContents.tsx'
import ShikiCode from './ShikiCode.tsx'
import highlightAllCodeBlocks from './shikiClient'

// MDX often renders code blocks as <pre><code className="language-...">...</code></pre>
// Provide a Pre wrapper that delegates the inner <code> to ShikiCode so language/className are preserved.
const Pre: React.FC<any> = (props) => {
  const children = React.Children.toArray(props.children) as any[]

  // Find a child that represents code: mdxType === 'code' or has a language- className
  const codeChild = children.find((c) => {
    if (!c || !c.props) return false
    const cls = c.props.className || ''
    return c.props.mdxType === 'code' || /language-/.test(cls) || /lang-/.test(cls)
  })

  if (codeChild) {
    // delegating to ShikiCode
    return <ShikiCode {...codeChild.props}>{codeChild.props.children}</ShikiCode>
  }

  return <pre {...props} />
}

const Layout = () => {
  const location = useLocation()
  const isPostPage = location.pathname.startsWith('/posts')
  const isIndexPage = location.pathname.endsWith('/') || 
    location.pathname === '/posts' || 
    location.pathname === '/posts/js_core' || 
    location.pathname === '/posts/english' ||
    location.pathname === '/posts/english/grammar' ||
    location.pathname === '/posts/english/document'||
    location.pathname === '/posts/algorithm'
  
  const showToc = isPostPage && !isIndexPage

  // Run client-side highlighter after content renders/hydrates
  React.useEffect(() => {
    // highlight after a short delay to let MDX content mount
    const id = setTimeout(() => {
      try {
        highlightAllCodeBlocks(document.querySelector('main') || document)
      } catch (e) {
        console.error('[Layout] highlightAllCodeBlocks failed', e)
      }
    }, 80)

    return () => clearTimeout(id)
  }, [location.pathname])

  return (
    <div className="layout-container">
      <NavBar />
      <div className={showToc ? 'content-with-toc' : ''}>
        {showToc && <TableOfContents />}
        <main className={isPostPage ? showToc ? 'prose max-w-3xl ml-10' : 'prose max-w-3xl m-auto' : 'px-7 py-10'}>
          <MDXProvider components={{ pre: Pre, code: ShikiCode }}>
            <Outlet />
          </MDXProvider>
        </main>
      </div>
    </div>
  )
}

export default Layout
