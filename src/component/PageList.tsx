import { Link } from 'react-router-dom'

import type { Article } from '../content/catalog'

const PageList = ({ pages, className }: { pages: readonly Article[]; className?: string }) => {
  return (
    <div className={className ?? 'page-list'}>
      <ul >
        {pages.map((page) => (
          <li key={page.path} >
            {page.status !== 'published' ? (
              <div>
                <h3 >{page.title} <small >待发布</small></h3>
                <div className="page-description">{page.description}</div>
              </div>
            ) : (
              <Link to={page.path} className="no-underline">
                <h3 >{page.title}</h3>
                <div className="page-description">{page.description}</div>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PageList
