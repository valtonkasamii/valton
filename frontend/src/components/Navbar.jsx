import React, {useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons'
const Navbar = () => {

  const [auth, setAuth] = useState(null)
  const [menu, setMenu] = useState(false)

  const handleClick = async () => {
    try {
        const response = await fetch("https://valton.vercel.app/api/auth/logout", {
            method: "POST",
            credentials: "include"
        })

        if (!response.ok) {
            const error = await response.json()
            console.error(error)
        } else {
        const data = await response.json()
        window.location = "/login"
        }
    } catch (error) {
        console.error(error.message)
    }
}

  const getMe = async () => {
    try {
      const response = await fetch("https://valton.vercel.app/api/auth/me", {
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
    } 
  }

  useEffect(() => {
    getMe()
  }, [])

  return (
    <div>
      
    {!auth && <div className='flex items-center justify-center h-[80px] w-full bg-[#222222] absolute'>
    <h1 className='font-[500] text-4xl text-[silver]'>V A L T O N</h1>
    </div>}

    {auth && <div className='flex items-center justify-between px-5 h-[80px] w-full bg-[#222222] absolute'>
    <h1 className='font-[500] text-4xl text-[silver]'>V A L T O N</h1>
      <div className='flex items-center space-x-2'>
      <a href='/'><FontAwesomeIcon className='h-7 bg-[#666666] py-2 px-2 rounded-full cursor-pointer' icon={faHome}/></a>    
      <FontAwesomeIcon onClick={() => setMenu(!menu)} className='h-7 cursor-pointer text-2xl bg-[#666666] py-2 px-[10px] rounded-full' icon={faUser}/>    
      </div>

      { menu && <div className='flex-col bg-[#333333] rounded-[20px] p-[10px] pt-[8px] items-center absolute right-[5%] top-[110%] z-10 flex font-[500] text-[silver]'>
      <a href={`${auth.username}`} className='cursor-pointer text-xl'>Profile</a>
      <p onClick={handleClick} className='cursor-pointer text-xl bg-[red] pb-1 pt-[1px] px-2 rounded-full mt-1 text-white'>Log Out</p>

      </div>}
      {menu && <div onClick={() => setMenu(false)} className='absolute h-[100vh] w-[100vw] top-0 left-0'></div>}

    </div>}

    </div>
  )
}

export default Navbar