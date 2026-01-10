import { NavLink, useLocation } from 'react-router-dom'

const EnglishNav = () => {
  const location = useLocation()
  const matchLen = (to: string) => {
    const p = location.pathname.replace(/\/$/, '')
    const t = to.replace(/\/$/, '')
    if (p === t) return t.length
    if (p.startsWith(t + '/')) return t.length
    return 0
  }

  const navLinks = ['/posts', '/posts/english']
  const maxMatch = Math.max(...navLinks.map(matchLen))

  return (
    <div className='prose m-auto'>
      <nav className='nav-sub text-3xl'>
        <NavLink to="/posts" className={() => matchLen('/posts') === maxMatch && maxMatch > 0 ? 'active' : ''}>Blog</NavLink>
        <NavLink to="/posts/english" className={() => matchLen('/posts/english') === maxMatch && maxMatch > 0 ? 'active' : ''}>English</NavLink>
      </nav>
      <nav className='nav-small text-2xl'>
        <NavLink to="/posts/english/grammar" className={() => matchLen('/posts/english/grammar') > 0 ? 'active' : ''}>语法</NavLink>
      </nav>
    </div>
  )
}

export default EnglishNav
