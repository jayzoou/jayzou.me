import SectionNav from './SectionNav'

const PostNav = () => {
  const mainLinks = [
    { to: '/posts/js_core', label: 'Blog' },
    { to: '/posts/english', label: 'English' },
  ]

  const smallLinks = [{ to: '/posts/js_core', label: 'JavaScript core' }]

  return <SectionNav mainLinks={mainLinks} smallLinks={smallLinks} />
}

export default PostNav
