import { createBrowserRouter } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react';
import { lazy, Suspense } from 'react'
import Layout from '../component/Layout.tsx'

// const isProd = import.meta.env.MODE === 'production'

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
// if(isProd) {
//   filename = filename.replace (/\..\/\..\/(pages)/, '')
// }
const Component = lazy( ()=> import(/* @vite-ignore */ `${filename}`))
return { path: `/${path}`, element: <MDXProvider><Suspense><Component /></Suspense></MDXProvider> }
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, 
    children: routes
  },
]);

export default router
