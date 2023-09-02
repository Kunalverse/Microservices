const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const Candidates = require('./models/candidates')
const axios = require('axios')

const app = express();
const port = 8003;

app.use(express.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_PASS}@cluster0.tbi2tfe.mongodb.net/Candidates?retryWrites=true&w=majority`;

mongoose.connect(uri,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
})
.then(()=>{
    console.log('Connected to database')
})
.catch(err=>{
    console.log(err);
})

app.get('/api/candidates', async(req,res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const response = await axios.post('http://localhost:8001/api/auth',{token});
        const isValidCheck = response.data.isValid;
        const isAdminCheck = response.data.userType === "admin"? true : false;
        const records = await Candidates.find({});
        const finalRecord = {
            records : records,
            isAdmin : isAdminCheck,
            isValid : isValidCheck
        }
        
        res.status(200).json(finalRecord);
    }catch(err){

        res.json(err)
    }
})

app.post('/api/candidates',async(req,res)=>{
    try{
        const {name} = req.body;
        const newCandidate = await Candidates.create({name});
        res.status(201).json(newCandidate);
    }
    catch(err){
        console.log(err);
    }
})

app.put('/api/candidates/:id',async(req,res)=>{
    const id = req.params.id
    const {name} = req.body;
    try{
        const record = await Candidates.findByIdAndUpdate(id,{name})
        record.save();
        res.status(200).send("Updated !");
    }
    catch(err){
        console.log(err)
    }
})

app.listen(port,()=>{
    console.log('Connected to '+port);
})