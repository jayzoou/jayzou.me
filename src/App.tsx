import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavBar from './component/NavBar.tsx'
import Home from './component/Home.tsx'
import ListPosts from './component/ListPosts.tsx'
import './App.css'


const App = () => {
  return (
    <Router>
      <NavBar />
      <main className='px-7 py-10'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<ListPosts />} />
        </Routes> 
      </main>
    </Router>
  )
}

export default App
