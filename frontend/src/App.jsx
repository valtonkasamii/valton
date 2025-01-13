import React, {useEffect, useState} from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import LoginPage from "./pages/auth/login/LoginPage"
import SignUpPage from "./pages/auth/signup/SignUpPage"
import Navbar from "./components/Navbar"
import './App.css'
import ProfilePage from "./pages/profile/ProfilePage"

function App() {

  const [auth, setAuth] = useState(null)
  const [loading, setLoading] = useState(true)

  const getMe = async () => {
    try {
      const response = await fetch("https://valton-1.onrender.com/api/auth/me", {
        credentials: "include"
      })
      if (!response.ok) {
        setAuth(null)
      } else {
      const data = await response.json()
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

  if (!loading) {
    return <div className="flex flex-col h-[100vh] justify-center items-center text-5xl text-white font-[500]"><h1>Loading...</h1><p className="text-xl mt-5 text-[silver] text-center px-2 py-1 rounded-[30px] mx-10 bg-[#222222]">It will take a minute to load because the backend is hosted with render's free plan which has bad cold starts.</p></div>
  }

  return (
    <>
    <Navbar />
     <Routes>
     <Route path='/' element={auth ? <HomePage /> : <Navigate to="/login"/>} />
     <Route path='/:username' element={auth ? <ProfilePage /> : <Navigate to="/login"/>} /> 
     <Route path='/login' element={!auth ? <LoginPage /> : <Navigate to="/" />} />
      <Route path='/signup' element={!auth ? <SignUpPage /> : <Navigate to="/" />} />
     </Routes>
    </>
  )
}

export default App
