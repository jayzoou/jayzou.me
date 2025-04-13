import { createBrowserRouter } from 'react-router-dom'
import { Suspense } from 'react'
import Layout from '../component/Layout.tsx'

const modules = import.meta.glob(
  [
    '../../pages/**/*.mdx',
  ], 
  { eager: true })

const routes = Object.keys(modules)
  .map((filename: string) => {
    const path = filename
      .replace (/\..\/\..\/(pages)/, '')
      .replace(/\//g,'')
      .replace(/\.(mdx|tsx)$/, '')
      .replace('Index', '')
    //@ts-ignore
    const Component = modules[filename].default
    return { path: `/${path}`, element: <Suspense><Component /></Suspense> }
  })

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, 
    children: routes
  },
]);

export default router
