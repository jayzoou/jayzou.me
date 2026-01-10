import PageList from '../../PageList'

const jsCorePages = [
  { path: '/posts/js_core/event_loop', title: 'Event Loop', desc: 'JavaScript 事件循环的原理与示例' },
]

const JsCoreList = () => {
  return <PageList pages={jsCorePages} className="jscore-list" />
}

export default JsCoreList
