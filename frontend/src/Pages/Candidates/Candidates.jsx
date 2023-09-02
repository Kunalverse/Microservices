import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Candidates() {
  const [data,setData] = useState([]);
  const [updatedName,setUpdatedName] = useState('');
  const [name,setName] = useState('');
  const [isUpdating,setIsUpdating] = useState('')
  const [valid,setValid] = useState(true)
  const [admin,setAdmin] = useState(false)
  const accessToken = localStorage.getItem('jwt');

  const addCandidate = async(e)=>{
    e.preventDefault();
    const response = await axios.post('http://localhost:8000/api/candidates',{name},{
      headers: {
        'Authorization': `Bearer ${accessToken}` 
      }
    });
    setData(prev => [...prev,response.data]);
    setName('');
  }

  useEffect(()=>{
    const getCandidates = async()=>{
      try {
        const res = await axios.get('http://localhost:8000/api/candidates',{
          headers: {
            'Authorization': `Bearer ${accessToken}` 
          }
        })
        console.log(res.data)
        setData(res.data.records);
        setValid(res.data.isValid);
        setAdmin(res.data.isAdmin);
      } catch (error) {
        console.log(error); 
      }
    }
    getCandidates();
  },[])

  const updateCandidate = async(e)=>{
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:8000/api/candidates/${isUpdating}`,{name : updatedName},{
        headers: {
          'Authorization': `Bearer ${accessToken}` 
        }
      });
      const updatedItemIndex = data.findIndex(item => item._id === isUpdating);
      data[updatedItemIndex].name = updatedName;
      setIsUpdating('');
      setUpdatedName('');
      console.log(res.data);
      
    } catch (error) {
      console.log(error);
    }
  }

  const renderUpdateForm = () =>{
    return(<form className='update-form' onSubmit={e => updateCandidate(e)}>
      <input type="text" className='update-new-input' value={updatedName} onChange={e => setUpdatedName(e.target.value)} />
      <button className='update-new-btn'>Update</button>
    </form>)
  }
  return (
    <div>
      <h2>Candidates</h2>
      {valid && admin ?<><h4>Add new candidate</h4>
      <form onSubmit={addCandidate}>
      <input type="text" value={name} onChange={e => setName(e.target.value)}/>
      <button >Add</button>
      </form> </> : ""
      }
      <div>
          {
            data.map(item => (
              <div>{
              isUpdating === item._id ?
              renderUpdateForm():
              <>
            <p>{item.name}</p>
            <>{valid && admin ? <button onClick={()=>setIsUpdating(item._id)}> Update</button> : ""}</>
            </>
          }
          </div>
          )
            )
          }
      </div>
    </div>
  )
}

export default Candidates