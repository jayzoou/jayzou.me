import { Outlet, useLocation } from 'react-router-dom'
import NavBar from './NavBar.tsx'

const Layout = () => {
  const location = useLocation()
  let mainClass = 'px-7 py-10'
  if (location.pathname.startsWith('/posts')) {
    mainClass = 'prose max-w-3xl m-auto'
  }
  return (
    <div>
      <NavBar />
      <main className={mainClass}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
