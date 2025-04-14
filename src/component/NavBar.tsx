import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <header className="flex justify-between items-center text-white">
      <Link to="/" className="ml-10 !text-white cursor-pointer transition scale-150 hover:scale-200">🤔</Link>
      <nav className='nav'>
        <div className='spacer'></div>
        <div className='flex gap-4 mr-10'>
          <Link to="/posts">Blog</Link>
          <a href="https://github.com/jayzoou" target='_blank'>GitHub</a> 
        </div>
      </nav>
    </header>
  )
}

export default NavBar
