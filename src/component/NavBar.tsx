import { NavLink, useLocation } from 'react-router-dom'

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
      <a href="/" className="ml-10 !text-white cursor-pointer transition scale-150 hover:scale-200">🤔</a>
      <nav className='nav'>
        <div className='spacer'></div>
        <div className='flex gap-4 mr-4'>
          <NavLink to="/posts/js_core" className={() => matchLen('/posts/js_core') === maxMatch && maxMatch > 0 ? 'active' : ''}>Blog</NavLink>
          <NavLink to="/projects" className={() => matchLen('/projects') === maxMatch && maxMatch > 0 ? 'active' : ''}>Projects</NavLink>
          <a href="https://ai.jayzou.me/" target='_blank' rel='noopener noreferrer'>AI Assistant</a>
          <a href="https://pageignore.github.io/letjs/" target='_blank' rel='noopener noreferrer'>letjs</a>
          <a href="https://github.com/jayzoou" target='_blank'>GitHub</a> 
        </div>
      </nav>
    </header>
  )
}

export default NavBar
