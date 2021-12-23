const Router = require('express').Router();

const userControllers = require('../controllers/userController')
const validator = require('../config/validator')

const { nuevoUsuario, accederACuenta,verifyEmail } = userControllers




Router.route('/verify/:uniqueString') //RECIBE EL LINK DE USUARIO
.get(verifyEmail) //LLAMA A FUNCION DE VERIFICACIION


Router.route('/auth/signUp') 
.post(validator, nuevoUsuario)

Router.route('/auth/signIn')
.post(accederACuenta)
module.exports = Router