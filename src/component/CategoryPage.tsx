import { getCategory } from '../content/catalog'
import SectionNav from './SectionNav'
import { mainLinks, postSmallLinks, englishSmallLinks } from '../lib/navLinks'
import CategoryList from './CategoryList'

const CategoryPage = ({ category }: { category: string }) => {
  const { section } = getCategory(category)
  return <>
    <SectionNav section={section} mainLinks={mainLinks} smallLinks={section === 'blog' ? postSmallLinks : englishSmallLinks} />
    <CategoryList category={category} />
  </>
}

export default CategoryPage
