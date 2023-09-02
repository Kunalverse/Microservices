const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express();
const port = 8000;

app.use(express.json())
app.use(cors())

// for signup
app.post('/api/users/signup',async(req,res)=>{
    try{
        const userData = req.body;
        const response = await axios.post('http://localhost:8002/api/signup',userData)
        console.log(response)
        res.status(response.status).json(response.data);
    }catch(err){
        res.json(err);
    }
})

//for signin
app.post('/api/users/signin',async(req,res)=>{
    try{
        const userData = req.body;
        const response = await axios.post('http://localhost:8002/api/signin',userData)
        res.status(response.status).json(response.data);
    }catch(err){
        res.json(err);
    }
})

//GET for candidates
app.get('/api/candidates',async(req,res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const response = await axios.get('http://localhost:8003/api/candidates',{
            headers: {
              'Authorization': `Bearer ${token}` 
            }
        });
        console.log(response.data)
        res.status(response.status).json(response.data);
        
    }
    catch(err){
        res.json(err)
    }
})

//POST for candidates
app.post('/api/candidates', async(req,res)=>{
    try{
        const details = req.body;
        const response = await axios.post('http://localhost:8003/api/candidates',details)
        res.status(response.status).json(response.data)
    }
    catch(err){
        res.json(err)
    }
})

//PUT for candidates
app.put('/api/candidates/:id', async(req,res)=>{

    try{
    const id = req.params.id;
    const details = req.body;
    const response = await axios.put(`http://localhost:8003/api/candidates/${id}`,details)
    res.status(response.status).json(response.data)
    }
    catch(err){
        res.json(err)
    }
})

//UserDetails
app.get('/api/users/userDetails',async(req,res)=>{
    const token = req.headers.authorization.split(' ')[1];
    try{
        const response = await axios.get('http://localhost:8002/api/userDetails',{
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        res.status(response.status).json(response.data)
        console.log(response.data)
    }catch(err){
        res.json(err)
    }
})


app.listen(port,()=>{
    console.log('Connected to '+port);
})