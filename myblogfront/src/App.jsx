import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Home from './components/Home'
import { Route, Routes,BrowserRouter, Navigate } from "react-router-dom";
// import BlogApp from './components/Blog'
import Register from './auth/Register'
import Login from './auth/Login'
import { useSelector } from 'react-redux';
import Blog from './components/Blog'
import Profile from './components/Profile'
function App() {
 
  const {access_token} = useSelector(state => state.auth);
  //Note => Need to work on like on blogpost authenticate user only and also like in comment or reply by authenticate user
  return (
    <>
    <BrowserRouter>
      <Navbar/>
      
      <Routes>
         <Route exact path="/" element={<Home />}/>
         <Route exact path="/blog" element={access_token ? <Blog/> : <Navigate to="/login" />}/>
         {/* <Route path="/blog/:id"  element={access_token ? <Blog/> : <Navigate to="/login" />}/> */}
         <Route exact path="/profile" element={access_token ? <Profile/> : <Navigate to="/login" />}/>
         <Route exact path="/register" element={<Register/>}/>
         <Route exact path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
