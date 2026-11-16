import { getCategory } from '../content/catalog'
import PageList from './PageList'

const CategoryList = ({ category }: { category: string }) => {
  const { articles } = getCategory(category)
  return <PageList pages={articles.filter(article => article.status !== 'reserved')} />
}

export default CategoryList
