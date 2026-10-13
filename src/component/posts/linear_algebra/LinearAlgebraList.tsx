import PageList from '../../PageList'

const linearAlgebraListPages = [
  { path: '/posts/linear_algebra/introduction', title: '几何直觉的重要性', desc: '理解线性代数的几何视角与数值视角' },
]

const LinearAlgebraList = () => {
  return <PageList pages={linearAlgebraListPages} className="linear-algebra-list" />
}

export default LinearAlgebraList
