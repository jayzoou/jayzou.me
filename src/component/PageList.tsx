import { Link } from 'react-router-dom'

type PageItem = {
  path: string
  title: string
  desc: string
}

const PageList = ({ pages, className }: { pages: PageItem[]; className?: string }) => {
  return (
    <div className={className ?? 'page-list'}>
      <ul className="list-none p-0">
        {pages.map((page) => (
          <li key={page.path} className="my-8 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors">
            <Link to={page.path} className="no-underline">
              <h3 className="m-0 text-lg font-semibold">{page.title}</h3>
              <div className="m-0 text-gray-500 text-sm">{page.desc}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PageList
