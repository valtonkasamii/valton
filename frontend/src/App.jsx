import React, {useEffect, useState} from "react"
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import LoginPage from "./pages/auth/login/LoginPage"
import SignUpPage from "./pages/auth/signup/SignUpPage"


function App() {

  const [auth, setAuth] = useState(null)
  const [loading, setLoading] = useState(true)

  const getMe = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/me", {
        credentials: "include"
      })
      if (!response.ok) {
        setAuth(null)
      } else {
      const data = await response.json()
        console.log(data)
        setAuth(data)
      }
    } catch (error) {
      console.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getMe()
  }, [])

  if (loading) {
    return <div className="flex h-[100vh] justify-center items-center text-5xl text-white font-[500]">Loading...</div>
  }

  return (
    <>
     <Routes>
     <Route path='/' element={auth ? <HomePage /> : <Navigate to="/login"/>} />
     <Route path='/login' element={!auth ? <LoginPage /> : <Navigate to="/" />} />
      <Route path='/signup' element={!auth ? <SignUpPage /> : <Navigate to="/" />} />
     </Routes>
    </>
  )
}

export default App
