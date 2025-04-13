import { Link } from 'react-router-dom'

const PostNav = () => {
  return (
    <nav className='nav text-3xl'>
        <Link to="/posts">Blog</Link>
      </nav>
  )
}

export default PostNav
