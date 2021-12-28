const Router = require('express').Router();

const userControllers = require('../controllers/userController');
const userConectedController = require('../controllers/usersConectedController')
const validator = require('../config/validator')

const { nuevoUsuario, accederACuenta,verifyEmail, cerraSesion } = userControllers;
const {addUser} = userConectedController;
// agregamos "cerrarSesion" para verificar que el usuario elimine los datos almacenados



Router.route('/verify/:uniqueString') //RECIBE EL LINK DE USUARIO
.get(verifyEmail) //LLAMA A FUNCION DE VERIFICACIION


Router.route('/auth/signUp') 
.post(validator, nuevoUsuario)


Router.route('/auth/signIn')
.post(accederACuenta)

Router.route('/auth/signOut')
.post(cerraSesion)


module.exports = Router




