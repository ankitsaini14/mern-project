
const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
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

    phonenumber: {
        type: Number,
        required: true
    },
    create: {
        type: String,
        default: new Date()
    },
    image:{
        type: String,
        default: 'fea08f8b1f84fd5d1d98050b30d100ba',
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

});


module.exports = mongoose.model("users", UserSchema);
