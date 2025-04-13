import { createBrowserRouter } from 'react-router-dom'
import { lazy } from 'react'
import Layout from '../component/Layout.tsx'

const isProd = import.meta.env.MODE === 'production'

const modules = import.meta.glob(
  [
    '../../pp/**/*.tsx',
  ], 
  { eager: true })
const routes = Object.keys(modules)
  .map((filename: string) => {
    const path = filename
      .replace (/\..\/\..\/(pp)/, '')
      .replace(/\//g,'')
      .replace(/\.(mdx|tsx)$/, '')
      .replace('Index', '')
    if(isProd) {
      filename = filename.replace (/\..\/\..\/(pp)/, '')
    }
    console.log(filename)
    const Component = lazy( ()=> import(/* @vite-ignore */ `${filename.replace(/\.tsx$/, '')}`))
    return { path: `/${path}`, element: <Component /> }
  })

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, 
    children: routes
  },
]);

export default router
