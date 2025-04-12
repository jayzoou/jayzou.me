import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <header className="flex justify-between items-center text-white">
      <Link to="/" className="ml-10 !text-white cursor-pointer transition scale-150 hover:scale-200">🤔</Link>
      <nav className='nav'>
        <Link to="/about">about</Link>
        <Link to="/posts">posts</Link>
      </nav>
    </header>
  )
}

export default NavBar
