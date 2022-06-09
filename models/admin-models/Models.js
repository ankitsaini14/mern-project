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
        default: 'fea08f8b1f84fd5d1d98050b30d100ba',
    },
    phonenumber:{
        type:String,
    }
});

module.exports = mongoose.model("UserFields", userSchema)