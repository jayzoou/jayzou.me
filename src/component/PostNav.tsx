import { Link } from 'react-router-dom'

const PostNav = () => {
  return (
    <div className='prose m-auto'>
      <nav className='nav-sub text-3xl'>
        <Link to="/posts">Blog</Link>
        <Link to="/posts/english">English</Link>
      </nav>
      <nav className='nav-small text-2xl'>
        <Link to="/posts/english/grammar">语法</Link>
        <Link to="/posts/english/document">精读文档</Link>
      </nav>
    </div>
  )
}

export default PostNav
