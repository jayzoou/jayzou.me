import PageList from '../../PageList'

const algorithmListPages = [
  { path: '/posts/algorithm/array', title: '数组', desc: '数组相关的算法和操作' },
  { path: '/posts/algorithm/stack_base', title: '栈与队列(基础篇)', desc: '数据结构入门' },
  { path: '/posts/algorithm/stack_advanced', title: '栈与队列(进阶篇)', desc: '高级技巧与优化' },
  { path: '/posts/algorithm/stack_practice', title: '栈与队列(实战篇)', desc: '真实场景应用' },
  { path: '/posts/algorithm/chain', title: '链表', desc: '链表相关的算法和操作' },
  { path: '/posts/algorithm/hash', title: '哈希表', desc: 'Map与Set的原理与实战' },
  { path: '/posts/algorithm/tree', title: '树结构基础', desc: '二叉树遍历与应用' },
  { path: '/posts/algorithm/tree_binary', title: '二叉搜索树', desc: '高效查找与应用' },
]

const AlgorithmList = () => {
  return <PageList pages={algorithmListPages} className="algorithm-list" />
}

export default AlgorithmList
