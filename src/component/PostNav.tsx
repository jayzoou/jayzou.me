import SectionNav from './SectionNav'
import { mainLinks, postSmallLinks } from '../lib/navLinks'

const PostNav = () => {
  return <SectionNav mainLinks={mainLinks} smallLinks={postSmallLinks} />
}

export default PostNav
