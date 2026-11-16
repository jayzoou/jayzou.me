import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import NavBar from './NavBar.tsx'
import TableOfContents from './TableOfContents.tsx'
import ShikiCode from './ShikiCode.tsx'
import highlightAllCodeBlocks from './shikiClient'

// MDX often renders code blocks as <pre><code className="language-...">...</code></pre>
// Provide a Pre wrapper that delegates the inner <code> to ShikiCode so language/className are preserved.
type CodeProps = React.ComponentProps<'code'> & { mdxType?: string }

const Pre = (props: React.ComponentProps<'pre'>) => {
  const codeChild = React.Children.toArray(props.children).find(
    (child): child is React.ReactElement<CodeProps> => {
      if (!React.isValidElement<CodeProps>(child)) return false
      const cls = child.props.className || ''
      return child.type === 'code' || child.props.mdxType === 'code' || /(?:language|lang)-/.test(cls)
    },
  )

  if (codeChild) {
    return <ShikiCode className={codeChild.props.className}>{codeChild.props.children}</ShikiCode>
  }

  return <pre {...props} />
}

const Layout = () => {
  const location = useLocation()
  const pathname = location.pathname.replace(/\/+$/, '') || '/'
  const isPostPage = pathname.startsWith('/posts')
  const isIndexPage = pathname === '/posts' ||
    pathname === '/posts/js_core' ||
    pathname === '/posts/english' ||
    pathname === '/posts/english/grammar' ||
    pathname === '/posts/english/document'||
    pathname === '/posts/algorithm' ||
    pathname === '/posts/design_patterns' ||
    pathname === '/posts/frontend' ||
    pathname === '/posts/vue' ||
    pathname === '/posts/linear_algebra'


  const showToc = isPostPage && !isIndexPage

  // Expose client readiness for production smoke tests and diagnostics.
  React.useEffect(() => {
    document.getElementById('root')?.setAttribute('data-hydrated', 'true')
  }, [])

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
