import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Home.css'

function Home() {
  const [email,setEmail] = useState('')
  const [valid,setValid] = useState(false)
  const navigate = useNavigate()
  const accessToken = localStorage.getItem('jwt');
  const handleSignout =()=>{
    localStorage.removeItem('jwt');
    navigate('/signin')
  }

  const handleSignIn =()=>{
    navigate('/signin')
  }
 
  useEffect(()=>{
    const getUser =async()=>{
      try{
        const response = await axios.get('http://localhost:8000/api/users/userDetails',{
          headers: {
            'Authorization': 'Bearer ' + accessToken
          }
        })
        setEmail(response.data.email);
        setValid(response.data.isValid);
      }catch(err){
        console.log(err)
      }
    }
    getUser();
  },[])
  return (
    <div className='home-page'>
      <nav className='navbar'>
        <ul className='nav-list'>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/candidates'>{valid ? "Candidates" : ""}</Link></li>
        </ul>
        <>{accessToken ? <button onClick={handleSignout}>Sign out</button> :<button onClick={handleSignIn}>Sign in</button> }</>
      </nav>
      <div className='welcome-container'>
      <h2>{accessToken ? `Hey, welcome to our site ${email}` : 'Please Sign in'}</h2>
      </div>
    </div>
  )
}

export default Home