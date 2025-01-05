import React, { useState, useEffect, useRef } from 'react'

const ProfilePage = () => {

    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [text, setText] = useState('')
    const fileInputRef = useRef(null);
    const [remove, setRemove] = useState('')
    const [del, setDel] = useState(false)
    const [postimg, setPostimg] = useState(null)
    const [loading2, setLoading2] = useState(true)
    const [auth, setAuth] = useState(null)
    const [posts, SetPosts] = useState([])
    const [follow, setFollow] = useState('')
    
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch("https://valton-1.onrender.com/api/posts/create", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({ text, postimg })
            })
    
            if (!response.ok) {
    
            } else {
            const data = await response.json()
            setText('')
            setPostimg(null)
            fileInputRef.current.value = ''
            allPosts()
          }
            setLoading(false)
        } catch (error) {
            console.error(error.message)
        }
    }

    const handleImageClick = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      };
    
      const handleFileChange = (e) => {
            const file = e.target.files[0]
            
            if (file) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setPostimg(reader.result)
                }
                reader.readAsDataURL(file)
            }
        }

        const handleRemoveImage = () => {
            setPostimg(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          };

          const handleRemove = (id) => {
            if (id == remove) {
              setRemove('')
            } else {
              setRemove(id)
            }
          }

          const handleDelete = async (id) => {
            setDel(true)
            try {
              const response = await fetch(`https://valton-1.onrender.com/api/posts/${id}`, {
                method: 'DELETE',
                credentials: "include"
              })
          
              if (!response.ok) {
          
              } else {
                  const data = await response.json()
                  allPosts()
              }
              setDel(false)
            } catch (error) {
              console.error(error.message)
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
            if (profile && auth) {
              allPosts();
            }
    }, [auth])

    useEffect(() => {
        if (profile && auth) {
            if (profile.followers.some(e => e.followingId == auth.id)) {
                setFollow("Unfollow")
            } else {setFollow("Follow")}
        }
}, [auth, profile])
   
    const pt = () => {
        if (!loading) { return 'pt-2' } else {return 'mb-[5px]'}
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
                SetPosts(data)
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

  return (
    <div className='text-3xl pt-[80px]'>
        {loading2 && <h1 className='flex items-center justify-center h-[80vh] text-[50px]  font-[500]'>Loading...</h1>}
        {profile && <div className='mt-5'>
            
            <div className='flex items-center justify-center space-x-5'>
            {profile.profileImg && <img className='w-[120px] rounded-full' src='pf.user.profileImg'/>}
            {!profile.profileImg && <img className='border-4 border-[#999999] w-[120px] rounded-full' src='/user.jpg'/>}
            <div className=''>
            <p className='font-[500] text-[silver]'>@{profile.username}</p>
            
            <div className='font-[500] flex text-[22px] space-x-5 mt-2'>
            <div className='flex flex-col items-center'>{profile.followers.length}<p>followers</p></div>
            <div className='flex flex-col items-center'>{profile.following.length}<p>following</p></div>

            </div>

            <div>
               {auth && auth.username !== profile.username && <button onClick={handleFollow} className='bg-[#555555] px-3 mt-2 font-  py-1 rounded-full mt- text-xl'>{follow}</button>}
            </div>

            </div>
            </div>

            {auth && auth.id == profile.id && <div className='flex justify-center mt-2'>
            <div className={`mt-3 bg-[#333333] ${pt()} pb-3 px-[20px] rounded-[30px]`}>
      {!loading && <h1 className='mb-2 ml-2 text-xl font-[500] text-[silver]'>Make a Post!</h1>}
         <form onSubmit={handleSubmit} className='items-center flex flex-col space-y-3'>
          {!loading && <input required minLength="10" value={text} onChange={(e) => setText(e.target.value)} maxLength="100" placeholder='Type something...' className='border-0 placeholder:text-[silver] px-2 bg-[#666666] border-2 border-[silver] rounded-full  text-[18px] w-[300px] h-[40px]' type='text'/>}
          <input ref={fileInputRef} onChange={handleFileChange} className='hidden' accept="image/*" type='file'/>
          {!loading && <div className='w-full flex justify-between'>
          {!postimg && <button type='button' onClick={handleImageClick} className='font-[500] text-xl bg-[#666666] px-3 flex justify-center items-center rounded-full h-[30px]'>Upload Image</button>}
          {postimg && <button type='button' onClick={handleRemoveImage} className=' font-[500] text-xl bg-[#666666] px-3 flex justify-center items-center rounded-full h-[30px]'>Remove Image</button>}
          <button className='font-[500] text-[19px] bg-[red] px-3 flex justify-center items-center rounded-full h-[30px]'>Post</button>
          </div>}
          {postimg && !loading && <img className='w-[230px] rounded-[30px] border-[2px] border-[silver]' src={postimg}/>}
          {loading && <h1 className='text-3xl font-[500] text-[silver]'>Loading...</h1>}
          </form> 
      </div>
      </div>}

            <div className='flex flex-col items-center'>
      {posts.length > 0 && posts.map((post, index) => (
        <div key={index} className='break-words whitespace-normal w-[340px] mt-5 bg-[#333333] rounded-[30px]'>
          <div className='flex justify-between items-center'><div className='flex items-center'>{post.user.profileImg && <img src={post.user.profileImg} />}
          {!post.user.profileImg && <img className='w-[60px] rounded-full ml-3 mt-3' src='user.jpg' />}
          <p className='text-2xl mt-2 ml-[5px]'>@{post.user.username}</p>
          </div>
          <div className='mt-2'>
          {auth.id === post.user.id && <img onClick={() => handleRemove(post.id)} className='w-12 mr-6 bg-[#666666] px-2 rounded-full cursor-pointer mt-2' src='/pngegg.png'/>}
          {remove == post.id && !del && <button onClick={() => (handleDelete(post.id))} className='mt-2 ml-[-17px] bg-[red] px-2 text-[18px] font-[500] rounded-full'>Delete</button>}
          {remove == post.id && del && <button className='mt-2 ml-[-17px] bg-[#666666] px-2 text-[18px] font-[500] rounded-full'>Loading</button>}
          </div>
          </div>
          <p className='text-xl px-5 pt-2 pb-3'>{post.text}</p>
          {post.img && <div className='flex justify-center mb-5'><img className='w-[300px] rounded-[30px]' src={post.img}/></div>}
        </div>
      ))}
      </div>
    <div className='mt-5'></div>

            </div>}
    </div>
  )
}

export default ProfilePage