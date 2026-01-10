import SectionNav from './SectionNav'
import { mainLinks, englishSmallLinks } from '../lib/navLinks'

const EnglishNav = () => {
  return <SectionNav mainLinks={mainLinks} smallLinks={englishSmallLinks} />
}

export default EnglishNav
