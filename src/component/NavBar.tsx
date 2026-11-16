import { NavLink, useLocation } from 'react-router-dom'

import InteractiveCat from './InteractiveCat'
import { mainLinks } from '../lib/navLinks'

const NavBar = () => {
  const location = useLocation()
  return (
    <header className="site-header">
      <a
        href="/"
        aria-label="Home"
        className="inline-flex items-center justify-center !text-white transition-transform duration-300 scale-125 hover:scale-150"
      >
        <InteractiveCat size={30} />
      </a>
      <nav className='site-nav' aria-label='主导航'>
        <div className='site-nav-links'>
          <NavLink to={mainLinks[0].to} className={() => location.pathname.startsWith('/posts') ? 'active' : ''}>Blog</NavLink>
          <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''}>Projects</NavLink>
          <a href="https://asklol.com/" target='_blank' rel='noopener noreferrer'>英雄联盟问答</a>
          <a href="https://pageignore.github.io/letjs/" target='_blank' rel='noopener noreferrer'>letjs</a>
          <a href="https://github.com/jayzoou" target='_blank'>GitHub</a> 
        </div>
      </nav>
    </header>
  )
}

export default NavBar
