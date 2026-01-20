import PageList from '../../PageList'

const algorithmListPages = [
  { path: '/posts/algorithm/array', title: '数组', desc: '数组相关的算法和操作' },
]

const AlgorithmList = () => {
  return <PageList pages={algorithmListPages} className="algorithm-list" />
}

export default AlgorithmList
