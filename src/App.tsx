import { RouterProvider } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import router from './router/index.tsx'
import './App.css'


const App = () => {
  return (
    <MDXProvider>
     <RouterProvider router={router} /> 
    </MDXProvider>
  )
}

export default App
