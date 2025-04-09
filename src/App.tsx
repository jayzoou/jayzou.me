import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavBar from './component/NavBar.tsx'
import './App.css'

const Home = () => <h2>Home Page</h2>
const About = () => <h2>About Page</h2>
const Posts = () => <h2>Posts Page</h2>

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/posts" element={<Posts />} />
      </Routes>
    </Router>
  )
}

export default App
