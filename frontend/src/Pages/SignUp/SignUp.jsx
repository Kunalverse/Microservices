import React, { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css'

function SignUp() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');
  const [jwt , setJWT] = useState('')
  const navigate = useNavigate();

  localStorage.setItem('jwt', jwt);

  const handleSubmit = async(e)=>{
    e.preventDefault();
    const user = {
      email,
      password
    }
    await axios.post('http://localhost:8000/api/users/signup',user)
    .then((response)=>{
      if(response.status === 400){
        setError('User already exists');
      }
      else if(response.status === 201){
        setJWT(response.data.token)
        navigate('/')
        console.log('Success')
      }
    })
    .catch(err=>{
      console.log(err);
      setError('User already exists');
    })
  }
  return (
    <div className='container'>
      <h3>SignUp</h3>
        <form onSubmit={handleSubmit}>
          <input type="email" id='email' placeholder='Email' onChange={e=> setEmail(e.target.value)}/>
          <input type="password" id='password' placeholder='Password' onChange={e=> setPassword(e.target.value)}/> 
          <button type='submit'>Sign up</button>
        </form>
        <p>{error}</p>
        <hr />
        <p>Already have an account ?</p>
        <Link to='/signin'><p>Sign in</p></Link>
    </div>
  )
}

export default SignUp