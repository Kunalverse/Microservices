const express = require('express')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const Users = require('./models/users')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const cookieParser = require('cookie-parser')

const port = 8002;
const app = express();
const salt = bcrypt.genSaltSync(10);

app.use(express.json())
app.use(cors())
app.use(cookieParser())

const uri = `mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_PASS}@cluster0.tbi2tfe.mongodb.net/Users?retryWrites=true&w=majority`;

mongoose.connect(uri)
.then(()=>{
    console.log('Connected to db');
})
.catch(err=>{
    console.log(err);
})


app.post('/api/signin', async(req,res)=>{
    const {email, password} = req.body;
    try{
        const userDB = await Users.findOne({email});
        if(userDB){
            if(bcrypt.compareSync(password, userDB.password)){
                const token = jwt.sign({_id:userDB._id},process.env.SECRET_KEY);
                userDB.tokens = userDB.tokens.concat({token});
                userDB.save();
                res.cookie("jwt",token);
                res.status(200).json({token})
            }
            else{
                res.status(400).json({error :'Invalid Password'})
            }
        }
        else{
            res.status(400).json({error :"User don't exits"})
        }
    }catch(err){
        res.json(err)
    }
})

app.post('/api/signup',async(req,res)=>{
    const {email, password} = req.body;
    const userDB = await Users.findOne({email});
    if(userDB){
        res.status(400).json({
            error :'Bad Request'
        });
    }else{
        const passHash = bcrypt.hashSync(password,salt);
        const newUser = await Users.create({
            email:email, 
            password : passHash
        });

        newUser.save();
        res.status(201).json({message : 'Sign up successfully'})
    }
})

//for user details
app.get('/api/userDetails',async(req,res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const verifyToken = jwt.verify(token,process.env.SECRET_KEY);
        const user = await Users.findOne({_id : verifyToken._id});
        const response = await axios.post('http://localhost:8001/api/auth',{token});
        const isValidCheck = response.data.isValid;
        const isAdminCheck = response.data.userType === "admin"? true : false;
        console.log(response.data.userType +' '+isValidCheck)
        const userDetail = {
            email : user.email,
            isAdmin : isAdminCheck,
            isValid : isValidCheck
        }
        res.status(200).json(userDetail);
    }catch(err){
        res.json(err);
    }
})

app.listen(port,()=>{
    console.log('Connected to '+ port);
})
