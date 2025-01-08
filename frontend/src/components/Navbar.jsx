import React, {useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser, faSearch } from '@fortawesome/free-solid-svg-icons'
const Navbar = () => {

  const [auth, setAuth] = useState(null)
  const [menu, setMenu] = useState(false)
  const [search2, setSearch2] = useState(false)
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])

  const handleClick = async () => {
    try {
        const response = await fetch("https://valton-1.onrender.com/api/auth/logout", {
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
    } 
  }

  const handleSearch = async () => {
    try {
        const response = await fetch("https://valton-1.onrender.com/api/users/search", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({ search })
        })

        if (!response.ok) {
        
        } else {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
        console.error(error.message)
    }
}

  useEffect(() => {
    getMe()
  }, [])

  useEffect(() => {
    if (search.length > 0) {
      handleSearch()
    } 
  }, [search])

  return (
    <div>
      
    {!auth && <div className='flex items-center justify-center h-[80px] w-full bg-[#222222] absolute'>
    <a href='/' className='font-[500] text-4xl text-[silver] bg-[#555555] px-3 py-1 rounded-full'>VALTON</a>
    </div>}

    {auth && <div className='flex items-center justify-between max-sm:px-2 px-5 h-[80px] w-full bg-[#222222] absolute'>
    <a href='/' className='font-[500] text-4xl text-[silver] bg-[#555555] px-3 py-1 rounded-full'>VALTON</a>
      <div className='flex items-center space-x-2'>
        <div onClick={() => setSearch2(!search2)} className='w-[50px] rounded-full h-[50px] bg-[#666666] flex items-center justify-center cursor-pointer'><FontAwesomeIcon className='text-[32px]   rounded-full' icon={faSearch}/></div>
      <a className='w-[50px] rounded-full h-[50px] bg-[#666666] flex items-center justify-center' href='/'><FontAwesomeIcon className='text-[28px] rounded-full' icon={faHome}/></a>    
      <div onClick={() => setMenu(!menu)} className='cursor-pointer w-[50px] rounded-full h-[50px] bg-[#666666] flex items-center justify-center'><FontAwesomeIcon className='text-[28px] text-2xl rounded-full' icon={faUser}/></div>    
      </div>

      { menu && <div className='flex-col bg-[#333333] rounded-[20px] p-[10px] pt-[8px] items-center absolute right-[5%] top-[110%] z-10 flex font-[500] text-[silver]'>
      <a href={`${auth.username}`} className='cursor-pointer text-xl'>Profile</a>
      <p onClick={handleClick} className='cursor-pointer text-xl bg-[red] pb-1 pt-[1px] px-2 rounded-full mt-2 text-white'>Log Out</p>

      </div>}
      {menu && <div onClick={() => setMenu(false)} className='absolute h-[100vh] w-[100vw] top-0 left-0'></div>}

    </div>}
        <div className='pt-[80px]'></div>
        <div className='flex justify-center'>
        {search2 && <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search Username' maxLength="12" className='z-30 bg-[#444444]  text-xl py-2 px-3 rounded-full mt-3' type='text'/>}
        {search2 && <div onClick={() => (setSearch2(false), setUsers([]), setSearch(''))} className='absolute top-0 left-0 w-full h-full'></div>}
        </div>
        {users.length !== 0 && search.length > 0 && <div className='flex justify-center'>
        <div className='relative flex bg-[#444444] py-2 w-[300px] rounded-[20px] flex-col mt-3 mb-'>
        {users.map((user, index) => (
          <a href={`/${user.username}`} className='py-2 ml-3 flex items-center space-x-3' key={index}>
            <img className='w-[70px] rounded-full' src={user.profileImg || '/user.jpg'}/>
            <p className='text-2xl font-[500]'>@{user.username}</p>
          </a>
        ))}</div></div>}
    </div>
  )
}

export default Navbar