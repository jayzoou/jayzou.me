import type { RouteObject } from 'react-router-dom'
import { viteReactStatic } from 'vite-react-static'
import Layout from './component/Layout'
import { eagerPages, lazyPages } from 'virtual:pages'
import { normalizeRoute, pagePathToRoute } from './lib/pageRoutes'
import 'virtual:uno.css'
import './styles/index.css'
import 'katex/dist/katex.min.css'

const currentPath = import.meta.env.SSR ? null : normalizeRoute(window.location.pathname)

// SSR loads every page for static generation. The browser loads its current page
// before hydration; other pages are resolved by the router only when navigating.
async function loadRoutes(): Promise<RouteObject[]> {
  return Promise.all(Object.entries(lazyPages).map(async ([filename, load]) => {
    const path = pagePathToRoute(filename)
    if (import.meta.env.SSR || normalizeRoute(path) === currentPath) {
      const { default: Component } = await load()
      return { path, element: <Component /> }
    }
    return { path, lazy: async () => ({ Component: (await load()).default }) }
  }))
}

function createApplication(routes: RouteObject[]) {
  return viteReactStatic({ routes: [{ path: '/', element: <Layout />, children: routes }] })
}

// The Vite plugin emits eager imports only for SSG, so no async import cycle
// can block static generation and no article body enters the shared browser entry.
export const createRoot = import.meta.env.SSR ? createApplication(Object.entries(eagerPages).map(([filename, module]) => ({
  path: pagePathToRoute(filename), element: <module.default />,
}))) : undefined

// Finish evaluating the browser entry before awaiting page imports.
if (!import.meta.env.SSR) void loadRoutes().then(createApplication)
