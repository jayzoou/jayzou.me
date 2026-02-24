import PageList from '../../PageList'

const frontendPages = [
  { path: '/posts/frontend/rendering', title: '渲染流程', desc: '浏览器渲染的流程和机制' },
  { path: '/posts/frontend/performance', title: '性能优化', desc: '提升前端性能的技巧和方法' },
  { path: '/posts/frontend/cache', title: '缓存', desc: '前端缓存的策略与实现' },
  { path: '/posts/frontend/ssr', title: '服务端渲染', desc: '服务端渲染的原理与实现' },
  { path: '/posts/frontend/lixian', title: '离线', desc: '前端离线应用的实现与优化' },
  { path: '/posts/frontend/http', title: 'HTTP', desc: 'HTTP 协议的原理与应用' },
]

const FrontendList = () => {
  return <PageList pages={frontendPages} className="frontend-list" />
}

export default FrontendList
