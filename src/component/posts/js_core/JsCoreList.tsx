import PageList from '../../PageList'

const jsCorePages = [
  { path: '/posts/js_core/scope', title: '作用域', desc: '变量的“地盘”谁说了算？' },
  { path: '/posts/js_core/execution_context', title: '执行上下文', desc: '代码运行时的“案发现场”' },
  { path: '/posts/js_core/event_loop', title: 'Event Loop', desc: 'JavaScript 事件循环的原理与示例' },
]

const JsCoreList = () => {
  return <PageList pages={jsCorePages} className="jscore-list" />
}

export default JsCoreList
