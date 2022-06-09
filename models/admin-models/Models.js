const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required:true
    },
        
    password: {
        type: String,
        required:true
    },
    image:{
        type: String,
    }
});

module.exports = userSchema