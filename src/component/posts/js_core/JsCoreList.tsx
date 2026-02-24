import PageList from '../../PageList'

const jsCorePages = [
  { path: '/posts/js_core/type', title: '值与类型', desc: '数据类型与隐式转换' },
  { path: '/posts/js_core/scope', title: '作用域', desc: '变量的“地盘”谁说了算？' },
  { path: '/posts/js_core/closure', title: '闭包', desc: '函数与其词法环境的组合体' },
  { path: '/posts/js_core/this', title: 'this', desc: '函数执行时的上下文对象' },
  { path: '/posts/js_core/prototype', title: '原型', desc: '对象的继承与共享机制' },
  { path: '/posts/js_core/event_loop', title: 'Event Loop', desc: 'JavaScript 事件循环的原理与示例' },
  { path: '/posts/js_core/promise', title: 'Promise', desc: 'JavaScript 异步编程的利器' },
]

const JsCoreList = () => {
  return <PageList pages={jsCorePages} className="jscore-list" />
}

export default JsCoreList
