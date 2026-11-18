import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import { getArticle, getPageMetadata } from '../content/catalog'
import NavBar from './NavBar'
import TableOfContents from './TableOfContents'
import CodeBlock from './CodeBlock'
import ArticleAssistant from './ai/ArticleAssistant'

const mdxComponents = { pre: CodeBlock }

const Layout = () => {
  const { pathname } = useLocation()
  const article = getArticle(pathname)
  const isArticle = article?.status === 'published'
  const isPostPage = pathname.startsWith('/posts')

  useEffect(() => {
    document.getElementById('root')?.setAttribute('data-hydrated', 'true')
    const metadata = getPageMetadata(pathname)
    document.title = metadata.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', metadata.description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', metadata.canonical)
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (metadata.noindex) {
      const element = robots || document.createElement('meta')
      element.name = 'robots'
      element.content = 'noindex'
      if (!robots) document.head.appendChild(element)
    } else robots?.remove()
  }, [pathname])

  return <div className={`site-layout${pathname === '/' ? ' site-layout-home' : ''}`}>
    <NavBar />
    <div className={isArticle ? 'content-with-toc' : 'content-container'}>
      {isArticle && <TableOfContents key={pathname} />}
      <main className={isPostPage ? 'prose page-content' : 'page-content'}>
        {isArticle && <ArticleAssistant key={article.path} articlePath={article.path} />}
        <MDXProvider components={mdxComponents}><Outlet /></MDXProvider>
      </main>
    </div>
  </div>
}

export default Layout
