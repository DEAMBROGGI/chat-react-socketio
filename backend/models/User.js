const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {type: String, required:true},
    lastName:{type: String, required:true},
    email:{type: String, required:true},
    password: {type:String, required:true},
    uniqueString:{type:String, required:true},
    emailVerified:{type:Boolean, required:true},
    google:{type:Boolean, required:true}
})

const User = mongoose.model('user', userSchema)

module.exports = User;