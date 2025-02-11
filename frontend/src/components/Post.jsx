import React, {useRef, useState, useEffect} from 'react'

const Post = ({posts, profile, auth}) => {
    const fileInputRef = useRef(null);
    const [localPosts, setLocalPosts] = useState(posts)
      const [postimg, setPostimg] = useState(null)
      const [loading, setLoading] = useState(false)
      const [text, setText] = useState('')
      const [remove, setRemove] = useState('')
      const [del, setDel] = useState(false)
      const handleImageClick = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      };

      useEffect(() => {
        setLocalPosts(posts)
      }, [posts])
    
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
            
            if (profile) {
                profilePosts()
            } else {
            allPosts()
            }
          }
            setLoading(false)
        } catch (error) {
            console.error(error.message)
        }
    }

    const allPosts = async () => {
        try {
            const response = await fetch("https://valton-1.onrender.com/api/posts/all", {
                credentials: "include"
            })
      
            if (!response.ok) {
      
            } else {
                const data = await response.json()
                setLocalPosts(data)
            }
        } catch (error) {
            console.error(error.message)
        }
      }

      const profilePosts = async () => {
        try {
                const response = await fetch(`https://valton-1.onrender.com/api/posts/user/${profile.username}`, {
                credentials: "include"
            })
      
            if (!response.ok) {
      
            } else {
                const data = await response.json()
                setLocalPosts(data)
            }
        } catch (error) {
            console.error(error.message)
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
            if (profile) {
                profilePosts()
            } else {
            allPosts()
            }
        }
        setDel(false)
      } catch (error) {
        console.error(error.message)
      }
    }
    
    const handleRemove = (id) => {
      if (id == remove) {
        setRemove('')
      } else {
        setRemove(id)
      }
    }
    
    const pt = () => {
      if (!loading) { return 'pt-2' } else {return 'mb-[5px]'}
    }

    const homeMargin = () => {
        if (profile) {
            return "mt-5"
        } else return "mt-3"
    }
  return (
    <div className='flex flex-col items-center'>
      {!auth && <div className='bg-[#333333] px-3 pb-2 pt-[4px] rounded-full mt-3 font-[500] text-[silver]'>Loading</div>}
      {(!profile || (auth && profile.username == auth.username)) && <div className={`${homeMargin()} bg-[#333333] ${pt()} pb-3 px-[20px] rounded-[30px]`}>
      {!loading && <h1 className='mb-2 ml-2 text-xl font-[500] text-[silver]'>Make a Post!</h1>}
         <form onSubmit={handleSubmit} className='items-center flex flex-col space-y-3'>
          {!loading && <input required minLength="10" value={text} onChange={(e) => setText(e.target.value)} maxLength="100" placeholder='Type something...' className='border-0 placeholder:text-[silver] px-3 bg-[#666666] border-[silver] rounded-full  text-[18px] w-[300px] h-[40px]' type='text'/>}
          <input ref={fileInputRef} onChange={handleFileChange} className='hidden' accept="image/*" type='file'/>
          {!loading && <div className='w-full flex justify-between'>
          {!postimg && <button type='button' onClick={handleImageClick} className='font-[500] text-xl bg-[#666666] px-3 flex justify-center items-center rounded-full h-[30px]'>Upload Image</button>}
          {postimg && <button type='button' onClick={handleRemoveImage} className=' font-[500] text-xl bg-[#666666] px-3 flex justify-center items-center rounded-full h-[30px]'>Remove Image</button>}
          <button className='font-[500] text-[19px] bg-[red] px-3 flex justify-center items-center rounded-full h-[30px]'>Post</button>
          </div>}
          {postimg && !loading && <img className='w-[230px] rounded-[30px] border-[2px] border-[silver]' src={postimg}/>}
          {loading && <h1 className='text-3xl font-[500] text-[silver]'>Loading...</h1>}
          </form> 
      </div>}
    
      {localPosts.length > 0 && localPosts.map((post, index) => (
        <div key={index} className='break-words whitespace-normal w-[340px] mt-5 bg-[#333333] rounded-[30px]'>
          <div className='flex justify-between items-center'><a href={`/${post.user.username}`}><div className='flex items-center'>
          {post.user.profileImg && <img className='h-[60px] w-[60px] object-cover rounded-full ml-3 mt-3' src={post.user.profileImg} />}
          {!post.user.profileImg && <img className='h-[60px] w-[60px] object-cover rounded-full ml-3 mt-3' src='user.jpg' />}
          <p className='text-2xl mt-2 ml-[7px]'>@{post.user.username}</p>
          </div></a>
          <div className='mt-2'>
          {auth && auth.id === post.user.id && <img onClick={() => handleRemove(post.id)} className='w-12 mr-6 bg-[#666666] px-2 rounded-full cursor-pointer mt-2' src='/pngegg.png'/>}
          {remove == post.id && !del && <button onClick={() => (handleDelete(post.id))} className='mt-2 ml-[-17px] bg-[red] px-2 py-1 text-[18px] font-[500] rounded-full'>Delete</button>}
          {remove == post.id && del && <button className='mt-2 ml-[-17px] bg-[#666666] px-2 py-1 text-[18px] font-[500] rounded-full'>Loading</button>}
          </div>
          </div>
          <p className='text-xl px-5 pt-2 pb-3'>{post.text}</p>
          {post.img && <div className='flex justify-center mb-5'><img className='w-[300px] rounded-[30px]' src={post.img}/></div>}
        </div>
      ))}
    <div className='mt-5'></div>
    </div>
  )
}

export default Post