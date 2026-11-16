import SectionNav from './SectionNav'
import { mainLinks, englishSmallLinks } from '../lib/navLinks'

const EnglishNav = () => {
  return <SectionNav section="english" mainLinks={mainLinks} smallLinks={englishSmallLinks} />
}

export default EnglishNav
