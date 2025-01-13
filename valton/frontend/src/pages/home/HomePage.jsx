import {useEffect, useState} from 'react'
import Post from '../../components/Post.jsx'

const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [auth, setAuth] = useState([])

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
    }
  }

useEffect(() => {
allPosts()
getMe()
}, [])

const allPosts = async () => {
  try {
      const response = await fetch("https://valton-1.onrender.com/api/posts/all", {
          credentials: "include"
      })

      if (!response.ok) {

      } else {
          const data = await response.json()
          setPosts(data)
      }
  } catch (error) {
      console.error(error.message)
  }
}

const followingPosts = async () => {
  try {
      const response = await fetch("https://valton-1.onrender.com/api/posts/following", {
          credentials: "include"
      })

      if (!response.ok) {

      } else {
          const data = await response.json()
          setPosts(data)
      }
  } catch (error) {
      console.error(error.message)
  }
}

  return (
    <div className=''>

       <div className='flex justify-center mt-3 space-x-3'>
        <button onClick={() => allPosts()} className='All Posts bg-[#444444] text-xl px-3 py-1 rounded-full font-[]'>All Posts</button>
        <button onClick={() => followingPosts()} className='All Posts bg-[#444444] text-xl px-3 py-1 rounded-full font-[]'>Following</button>
        </div> 

    <Post posts={posts} auth={auth}/>
      
    </div>
  )
}

export default HomePage