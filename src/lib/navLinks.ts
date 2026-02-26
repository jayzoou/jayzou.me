export type LinkItem = { to: string; label: string }

export const mainLinks: LinkItem[] = [
  { to: '/posts/js_core', label: 'Blog' },
  { to: '/posts/english/grammar', label: 'English' },
]

export const postSmallLinks: LinkItem[] = [
  { to: '/posts/js_core', label: 'JS核心' },
  { to: '/posts/design_patterns', label: '设计模式' },
  { to: '/posts/algorithm', label: '算法' },
  { to: '/posts/vue', label: 'Vue' },
  { to: '/posts/frontend', label: '前端开发' },
]

export const englishSmallLinks: LinkItem[] = [{ to: '/posts/english/grammar', label: '语法' }]

export default mainLinks
