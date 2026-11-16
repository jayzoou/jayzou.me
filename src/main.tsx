import type { ComponentType } from 'react'
import { viteReactStatic } from 'vite-react-static'
import Layout from './component/Layout.tsx'
import { pagePathToRoute } from './lib/pageRoutes.ts'
import 'virtual:uno.css'
import './index.css'
import './App.css'
import 'katex/dist/katex.min.css'

const modules = import.meta.glob<{ default: ComponentType }>(
  [
    '../pages/**/*.mdx',
  ], 
  { eager: true }
)

const routes = Object.keys(modules)
  .map((filename: string) => {
    const Component = modules[filename].default
    return { path: pagePathToRoute(filename), element: <Component /> }
  })

export const createRoot = viteReactStatic({
  routes: [
    {
      path: '/',
      element: <Layout />, 
      children: routes
    },
  ] 
})
