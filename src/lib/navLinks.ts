import { categories, sections, getCategory } from '../content/catalog'

export type LinkItem = { to: string; label: string }

export const mainLinks: LinkItem[] = sections.map(section => ({
  to: getCategory(section.defaultCategory).path,
  label: section.label,
}))

const categoryLinks = (section: 'blog' | 'english'): LinkItem[] => categories
  .filter(category => category.section === section && category.navigation)
  .map(category => ({ to: category.path, label: category.label }))

export const postSmallLinks = categoryLinks('blog')
export const englishSmallLinks = categoryLinks('english')
