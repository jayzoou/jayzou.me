import { Outlet, useLocation } from 'react-router-dom'
import NavBar from './NavBar.tsx'
import TableOfContents from './TableOfContents.tsx'

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

  return (
    <div className="layout-container">
      <NavBar />
      <div className={showToc ? 'content-with-toc' : ''}>
        {showToc && <TableOfContents />}
        <main className={isPostPage ? showToc ? 'prose max-w-3xl ml-10' : 'prose max-w-3xl m-auto' : 'px-7 py-10'}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
