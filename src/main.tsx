// import { StrictMode } from 'react'
import { viteReactStatic } from 'vite-react-static'
import Layout from './component/Layout.tsx'
// import { createRoot } from 'react-dom/client'
import 'virtual:uno.css'
import './index.css'
import './App.css'
// import App from './App.tsx'

const modules = import.meta.glob(
  [
    '../pages/**/*.mdx',
  ], 
  { eager: true })
const routes = Object.keys(modules)
  .map((filename: string) => {
    const path = filename
      .replace (/\..\/(pages)/, '')
      .replace(/^\//g,'')
      .replace(/\.(mdx|tsx)$/, '')
      .replace('Index', '')
    //@ts-ignore
    const Component = modules[filename].default
    return { path: `/${path}`, element: <Component /> }
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

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
