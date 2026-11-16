declare module 'virtual:pages' {
  import type { ComponentType } from 'react'
  type PageModule = { default: ComponentType }
  export const eagerPages: Record<string, PageModule>
  export const lazyPages: Record<string, () => Promise<PageModule>>
}
