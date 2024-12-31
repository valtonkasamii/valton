import React, {useState} from 'react'

const SignUpPage = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
        const response = await fetch("https://valton.vercel.app/api/auth/signup", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ username, password }),
            credentials: "include"
        })

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
          } else {
        const data = await response.json()
        console.log(data)
          
            window.location = "/"

          }
          
        } catch (error) {
            console.error(error.message)
        }
    }
  return (
    <div className='flex flex-col justify-center items-center h-[100vh]'>


        <div className='bg-[#222222] flex justify-center items-center flex-col border- border-[#222222] px-10 pb-4 pt-2 rounded-[30px]'>
            <h1 className='text-[gray] mb-3 text-2xl font-[500]'>Sign Up</h1>
        
            <form onSubmit={handleSubmit} className='text-xl flex flex-col items-center space-y-2'>
                <input value={username} onChange={(e) => setUsername(e.target.value)} required placeholder='username' className='h-[30px] pb-[3px] px-2 w-[200px] bg-[#444444] rounded-[30px] flex items-center justify-center' type='username'></input>
                <input value={password} onChange={(e) => setPassword(e.target.value)} required placeholder='password' className='h-[30px] pb-[3px] px-2 w-[200px] bg-[#444444] rounded-[30px]' type='password'></input>
                <button className='bg-[#444444] px-3 rounded-full text-[silver]'>Enter</button>
            </form>
        </div>

    </div>
  )
}

export default SignUpPage
