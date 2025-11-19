import { Outlet } from 'react-router-dom'
import NavBar from './NavBar.tsx'

let mainClass = 'px-7 py-10'
if (typeof location === 'object' && location.pathname.startsWith('/posts')) {
  mainClass = 'prose max-w-3xl m-auto'
  console.log('Applying prose styling for posts', mainClass)
}
console.log('Current pathname:', mainClass)

const Layout = () => {
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
