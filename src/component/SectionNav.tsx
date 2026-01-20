import { NavLink, useLocation } from 'react-router-dom'

type LinkItem = { to: string; label: string }

const SectionNav = ({ mainLinks, smallLinks }: { mainLinks: LinkItem[]; smallLinks: LinkItem[] }) => {
  const location = useLocation()
  const matchLen = (to: string) => {
    const p = location.pathname.replace(/\/$/, '')
    const t = to.replace(/\/$/, '')
    if (p === t) return t.length
    if (p.startsWith(t + '/')) return t.length
    return 0
  }

  const maxMatch = Math.max(...mainLinks.map((l) => matchLen(l.to)))

  return (
    <div className='prose m-auto'>
      <nav className='nav-sub flex items-center gap-6 text-3xl'>
        {mainLinks.map((l) => (
          <NavLink key={l.to} to={l.to} className={() => (matchLen(l.to) === maxMatch && maxMatch > 0 ? 'active' : '')}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <nav className='nav-small flex items-center gap-4 text-2xl'>
        {smallLinks.map((l) => (
          <NavLink key={l.to} to={l.to} className={() => (matchLen(l.to) > 0 ? 'active' : '')}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default SectionNav
