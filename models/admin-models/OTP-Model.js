const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTPModel = new Schema({
    userId: String,
    otp: {
        type: String,
        required: true  
    },
    create: {
        type: String,
        default: new Date()
    },
    expired: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    } 


})

module.exports = mongoose.model("userOtp", OTPModel);