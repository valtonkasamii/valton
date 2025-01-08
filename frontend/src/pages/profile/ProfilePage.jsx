import React, { useState, useEffect, useRef } from 'react'
import Post from '../../components/Post.jsx'

const ProfilePage = () => {
    const fileInputRef = useRef(null);
    const [profile, setProfile] = useState(null)
    const [loading2, setLoading2] = useState(true)
    const [auth, setAuth] = useState(null)
    const [follow, setFollow] = useState('')
    const [posts, setPosts] = useState([])
    const [pfp, setPfp] = useState(null)
    const [loading3, setLoading3] = useState (false)

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

    
    const getProfile = async () => {
        const username = window.location.href.split("/").pop()

        try {
            const response = await fetch(`https://valton-1.onrender.com/api/users/profile/${username}`, {
                credentials: 'include'
            })

            if (!response.ok) {

            } else {
            const data = await response.json()
            setProfile(data)
        }
        
        
        setLoading2(false)
        } catch (error) {
            console.error(error.message)
        }
        
    }

    useEffect(() => {
        getMe()
        getProfile();
    }, [])


    useEffect(() => {
            if (profile) {
              allPosts();
            }
    }, [profile])

    useEffect(() => {
        if (profile && auth) {
            if (profile.followers.some(e => e.followingId == auth.id)) {
                setFollow("Unfollow")
            } else {setFollow("Follow")}
        }
    }, [auth, profile])

    useEffect(() => {
      if (pfp) {
        setLoading3(true)
      newPfp()
      }
    }, [pfp])
   
    const newPfp = async () => {
      try {
          const response = await fetch("https://valton-1.onrender.com/api/users/pfp", {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              credentials: "include",
              body: JSON.stringify({ pfp })
          })
  
          if (!response.ok) {
  
          } else {
          const data = await response.json()
          fileInputRef.current.value = ''
          getProfile()
          allPosts()
          setLoading3(false)
        }
      } catch (error) {
          console.error(error.message)
      }
  }

      const allPosts = async () => {
        if (!profile) return
        try {
            const response = await fetch(`https://valton-1.onrender.com/api/posts/user/${profile.username}`, {
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

      const handleFollow = async () => {
        try {
            const response = await fetch(`https://valton-1.onrender.com/api/users/follow/${profile.id}`, {
                credentials: 'include',
                method: 'POST'
            })
            getProfile()
            if (!response.ok) {
      
            } else {
                const data = await response.json()
                console.log(data)
            }
        } catch (error) {
            console.error(error.message)
        }
      }

      const handleFileChange = (e) => {
        const file = e.target.files[0]
        
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPfp(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleImageClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const profilePic = () => {
      if (!loading3) {
        return "Profile Pic"
      } else return "Loading..."
    }

  return (
    <div className='text-3xl'>
        {loading2 && <h1 className='flex items-center justify-center h-[80vh] text-[50px]  font-[500]'>Loading...</h1>}
        {profile && <div className='mt-5'>
            
            <div className='flex items-center justify-center space-x-5'>
            {profile.profileImg && <img className='border-4 border-[#999999] w-[120px] h-[120px] object-cover rounded-full' src={profile.profileImg}/>}
            {!profile.profileImg && <img className='border-4 border-[#999999] w-[120px] rounded-full' src='/user.jpg'/>}
            <div className=''>
            <p className='font-[500] text-[silver]'>@{profile.username}</p>
            
            <div className='font-[500] flex text-[22px] space-x-5 mt-2'>
            <div className='flex flex-col items-center'>{profile.followers.length}<p>followers</p></div>
            <div className='flex flex-col items-center'>{profile.following.length}<p>following</p></div>

            </div>

            <div>
               {auth && auth.username !== profile.username && <button onClick={handleFollow} className='bg-[#555555] px-3 mt-2 font-  py-1 rounded-full mt- text-xl'>{follow}</button>}
               {auth && auth.username == profile.username && <button onClick={handleImageClick} className='bg-[#555555] px-3 mt-2 font-  py-1 rounded-full mt- text-xl'>{profilePic()}</button>}
            </div>

            <input ref={fileInputRef} onChange={handleFileChange} className='hidden' accept="image/*" type='file'/>

            </div>
            </div>

            <Post posts={posts} profile={profile} auth={auth}/>

            </div>}
    </div>
  )
}

export default ProfilePage