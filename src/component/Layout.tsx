import { Outlet } from 'react-router-dom'
import NavBar from './NavBar.tsx'

const Layout = () => {
  let mainClass = 'px-7 py-10'
  if (typeof location === 'object' && location.pathname.startsWith('/posts')) {
    mainClass = 'prose max-w-3xl m-auto'
  }
  return (
    <div>
      <NavBar />
      <main className={mainClass}>
        <div>{typeof location === 'object' && location.pathname}</div>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
