const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config();
const cors = require('cors')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const Users = require('./models/users')

const app = express();
const port = 8001;

app.use(express.json())
app.use(cors())
app.use(cookieParser())

const uri = `mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_PASS}@cluster0.tbi2tfe.mongodb.net/Users?retryWrites=true&w=majority`;

mongoose.connect(uri,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
})
.then(()=>{
    console.log('Connected to db');
})
.catch(err =>{
    console.log(err);
})

app.post('/api/auth', async(req,res)=>{
    try{
        const {token} = req.body;
        const verifyToken = jwt.verify(token,process.env.SECRET_KEY);
        const user = await Users.findOne({_id : verifyToken._id});       
        if(user){
            if(user.email === 'kunal@gmail.com'){
                res.status(200).json({
                    isValid : true,
                    userType : "admin"
                })
            }
            else{
                res.status(200).json({
                    isValid : true,
                    userType : "user"
                })
            }
        }
        else{
            res.status(400).json({
                isValid : false,
                userType : undefined
            })
        }
    }catch(err){
        res.json(err)
    }
})

app.listen(port,()=>{
    console.log('Connected to '+port);
})
