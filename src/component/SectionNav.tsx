import { NavLink, useLocation } from 'react-router-dom'
import { getCategory, sections } from '../content/catalog'

type LinkItem = { to: string; label: string }

const SectionNav = ({ mainLinks, smallLinks, section }: { mainLinks: LinkItem[]; smallLinks: LinkItem[]; section: 'blog' | 'english' }) => {
  const location = useLocation()
  const matchLen = (to: string) => {
    const p = location.pathname.replace(/\/$/, '')
    const t = to.replace(/\/$/, '')
    if (p === t) return t.length
    if (p.startsWith(t + '/')) return t.length
    return 0
  }

  const activeSection = sections.find(item => item.id === section)
  const activePath = activeSection ? getCategory(activeSection.defaultCategory).path : ''

  return (
    <div className='section-navigation'>
      <nav className='nav-sub' aria-label='内容栏目'>
        {mainLinks.map((l) => (
          <NavLink key={l.to} to={l.to} className={() => (l.to === activePath ? 'active' : '')}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <nav className='nav-small' aria-label='文章分类'>
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
