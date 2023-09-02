const mongoose = require('mongoose')

const candidateSchema = new mongoose.Schema({
    name : {
        type: String,
        required : true,
    }
})

module.exports = mongoose.model('Candidates',candidateSchema)