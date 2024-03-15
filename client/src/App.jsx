import './App.css'
import { ChakraProvider } from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom'
import ParentContext, { AppContext } from './context/ParentContext'
import Home from './components/Home'
import Community from './components/Community'
import Blog from './components/Blog'
import Adopt from './components/Adopt'
import Donate from './components/Donate'


function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path="*" element={<h1>PAGE NOT FOUND</h1>}></Route>
        <Route path='/Community' element={<Community/>}></Route>
        <Route path='/Blog' element={<Blog/>}></Route>
        <Route path='/Adopt' element={<Adopt/>}></Route>
        <Route path='/Donate' element={<Donate/>}></Route>
      </Routes>
    </ChakraProvider>
  )
}

export default App
