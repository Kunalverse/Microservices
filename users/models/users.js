const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    tokens : [{
        token :{
            type : String,
            required : true
        }
    }]
    
})


module.exports = mongoose.model('Users',userSchema)