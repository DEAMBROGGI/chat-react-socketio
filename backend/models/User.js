const { string } = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {type: String, required:true},
    lastName:{type: String, required:true},
    email:{type: String, required:true},
    password: {type:String, required:true},
    uniqueString:{type:String, required:true},
    emailVerified:{type:Boolean, required:true}, //se agrega este campo para controlar si se verifico el email
    google:{type:Boolean, required:true},
    isConected:{type:Boolean, required:true}, //Se agrega este campo para verificar si el usuario esta en linea
    files:{type:Array} //Se grega este campo a la coleccion para almacenar los files
})

const User = mongoose.model('user', userSchema)

module.exports = User; 