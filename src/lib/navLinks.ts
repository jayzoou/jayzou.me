export type LinkItem = { to: string; label: string }

export const mainLinks: LinkItem[] = [
  { to: '/posts/js_core', label: 'Blog' },
  { to: '/posts/english/grammar', label: 'English' },
]

export const postSmallLinks: LinkItem[] = [{ to: '/posts/js_core', label: 'JavaScript Core' }]

export const englishSmallLinks: LinkItem[] = [{ to: '/posts/english/grammar', label: '语法' }]

export default mainLinks
