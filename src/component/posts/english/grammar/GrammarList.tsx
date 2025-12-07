import { Link } from 'react-router-dom'

const grammarPages = [
  { path: '/posts/english/grammar/element', title: '成分', desc: '主语、谓语、宾语、定语、状语、补语' },
  { path: '/posts/english/grammar/part-of-speech', title: '词性', desc: '名词、动词、形容词、副词等' },
  { path: '/posts/english/grammar/basic-sentence-patterns', title: '基本句型', desc: '五种基本句型结构' },
  { path: '/posts/english/grammar/tenses', title: '时态', desc: '英语十六种时态' },
  { path: '/posts/english/grammar/noun-clause', title: '名词性从句', desc: '主语从句、宾语从句、表语从句、同位语从句' },
  { path: '/posts/english/grammar/adj-clause', title: '定语从句', desc: '形容词性从句' },
  { path: '/posts/english/grammar/adv-clause', title: '状语从句', desc: '副词性从句' },
]

const GrammarList = () => {
  return (
    <div className="grammar-list">
      <h1>英语语法</h1>
      <ul className="list-none p-0">
        {grammarPages.map((page) => (
          <li key={page.path} className="my-4 p-4 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors">
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

export default GrammarList
