import PageList from '../../PageList'

const vuePages = [
  { path: '/posts/vue/design_thinking', title: 'Vue的设计思路', desc: '声明式渲染与组件化' },
  { path: '/posts/vue/reactive_system', title: '响应式系统', desc: '数据驱动的视图更新机制' },
  { path: '/posts/vue/compiler', title: '编译器', desc: '模板编译与渲染机制' },
  { path: '/posts/vue/runtime', title: '运行时', desc: '虚拟DOM与渲染过程' },
  { path: '/posts/vue/component', title: '组件化', desc: '组件的创建与组合' },
  { path: '/posts/vue/ssr', title: '服务端渲染', desc: '服务端渲染的实现与优化' },
]

const VueList = () => {
  return <PageList pages={vuePages} className="vue-list" />
}

export default VueList
