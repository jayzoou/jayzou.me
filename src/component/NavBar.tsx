import { NavLink, useLocation } from 'react-router-dom'

import InteractiveCat from './InteractiveCat'

const NavBar = () => {
  const location = useLocation()
  const matchLen = (to: string) => {
    const p = location.pathname.replace(/\/$/, '')
    const t = to.replace(/\/$/, '')
    if (p === t) return t.length
    if (p.startsWith(t + '/')) return t.length
    return 0
  }
  const links = ['/posts', '/projects']
  const maxMatch = Math.max(...links.map(matchLen))
  return (
    <header className="flex justify-between items-center text-white">
      <a
        href="/"
        aria-label="Home"
        className="ml-10 inline-flex items-center justify-center !text-white transition-transform duration-300 scale-125 hover:scale-150"
      >
        <InteractiveCat size={30} />
      </a>
      <nav className='nav'>
        <div className='spacer'></div>
        <div className='flex gap-4 mr-4'>
          <NavLink to="/posts/js_core" className={() => matchLen('/posts/js_core') === maxMatch && maxMatch > 0 ? 'active' : ''}>Blog</NavLink>
          <NavLink to="/projects" className={() => matchLen('/projects') === maxMatch && maxMatch > 0 ? 'active' : ''}>Projects</NavLink>
          <a href="https://asklol.com/" target='_blank' rel='noopener noreferrer'>英雄联盟问答</a>
          <a href="https://pageignore.github.io/letjs/" target='_blank' rel='noopener noreferrer'>letjs</a>
          <a href="https://github.com/jayzoou" target='_blank'>GitHub</a> 
        </div>
      </nav>
    </header>
  )
}

export default NavBar
