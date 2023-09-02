import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './SignIn.css'

function SignIn() {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const navigate = useNavigate();

  const handleSubmit =async(e)=>{
    e.preventDefault();
    const user ={
      email,
      password
    }

    try{
      const response = await axios.post('http://localhost:8000/api/users/signin',user);
      localStorage.setItem('jwt', response.data.token);
      navigate('/')
    }catch(err){
      console.log(err)
    }
    
}
  return (
    <div className='container'>
      <h3>Sign In</h3>
        <form onSubmit={handleSubmit}>
          <input type="email" id='email' placeholder='Email' onChange={e=>setEmail(e.target.value)}/>
          <input type="password" id='password' placeholder='Password' onChange={e=>setPassword(e.target.value)}/>
          <button type='submit'>Sign in</button>
        </form>
        <hr />
        <p>Don't have an account ?</p>
        <Link to='/signup'><p>Sign up</p></Link>
    </div>
  )
}

export default SignIn