import React, {useState} from 'react'

const LoginPage = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState('')


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
        const response = await fetch("https://valton-1.onrender.com/api/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ username, password }),
            credentials: "include"
        })

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
            setError(errorData.error)
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


        <div className='bg-[#222222] flex justify-center items-center flex-col border- border-[#222222] px-10 pt-4 pb-3 rounded-[30px]'>
        
            <form onSubmit={handleSubmit} className='text-xl flex flex-col items-center space-y-3'>
                <input value={username} onChange={(e) => setUsername(e.target.value)} required placeholder='username' className='h-[30px] pb-[3px] px-2 w-[200px] bg-[#444444] rounded-[30px] flex items-center justify-center' type='username'></input>
                <input value={password} onChange={(e) => setPassword(e.target.value)} required placeholder='password' className='h-[30px] pb-[3px] px-2 w-[200px] bg-[#444444] rounded-[30px]' type='password'></input>
                <button className='bg-[#444444] px-3 rounded-full text-[silver] pb-1 font-[500]'>Login</button>
            </form>
            {error && <p className='text-[red] mb-[-6px] mt-1'>{error}</p>}
        </div>
        <a href='/signup' className='text-[17px] rounded-full font-[500] text-[silver] mt-1'>Sign Up</a>


    </div>
  )
}

export default LoginPage
