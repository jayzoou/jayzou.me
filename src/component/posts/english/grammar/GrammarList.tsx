import PageList from '../../../PageList'

const grammarPages = [
  { path: '/posts/english/grammar/introduction', title: '花一周掌握“够用”的英语语法', desc: '爱情应该是“长跑”，而语法不是' },
  { path: '/posts/english/grammar/element', title: '成分', desc: '主语、谓语、宾语、定语、状语、补语' },
  { path: '/posts/english/grammar/part-of-speech', title: '词性', desc: '名词、动词、形容词、副词等' },
  { path: '/posts/english/grammar/basic-sentence-patterns', title: '基本句型', desc: '五种基本句型结构' },
  { path: '/posts/english/grammar/tenses', title: '时态', desc: '英语十六种时态' },
  { path: '/posts/english/grammar/noun-clause', title: '名词性从句', desc: '主语从句、宾语从句、表语从句、同位语从句' },
  { path: '/posts/english/grammar/adj-clause', title: '定语从句', desc: '形容词性从句' },
  { path: '/posts/english/grammar/adv-clause', title: '状语从句', desc: '副词性从句' },
]

const GrammarList = () => {
  return <PageList pages={grammarPages} className="grammar-list" />
}

export default GrammarList
