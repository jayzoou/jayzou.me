import SectionNav from './SectionNav'

const EnglishNav = () => {
  const mainLinks = [
    { to: '/posts/js_core', label: 'Blog' },
    { to: '/posts/english', label: 'English' },
  ]

  const smallLinks = [{ to: '/posts/english/grammar', label: '语法' }]

  return <SectionNav mainLinks={mainLinks} smallLinks={smallLinks} />
}

export default EnglishNav
