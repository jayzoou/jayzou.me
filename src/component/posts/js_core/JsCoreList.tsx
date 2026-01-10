import { Link } from 'react-router-dom'

const jsCorePages = [
  { path: '/posts/js_core/event_loop', title: 'Event Loop', desc: 'JavaScript 事件循环的原理与示例' },
]

const JsCoreList = () => {
  return (
    <div className="jscore-list">
      <ul className="list-none p-0">
        {jsCorePages.map((page) => (
          <li key={page.path} className="my-4 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors">
            <Link to={page.path} className="no-underline">
              <h3 className="m-0 text-lg font-semibold">{page.title}</h3>
              <p className="m-0 mt-1 text-gray-500 text-sm">{page.desc}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default JsCoreList
