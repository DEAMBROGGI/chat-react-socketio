const Router = require('express').Router();

const userControllers = require('../controllers/userController');
const userConectedController = require('../controllers/usersConectedController')
const fileController = require('../controllers/filesController')
const validator = require('../config/validator')

const { nuevoUsuario, accederACuenta,verifyEmail, cerraSesion } = userControllers;
const {addUser} = userConectedController;
const {getFiles, uploadFile, deleteFile} = fileController
// agregamos "cerrarSesion" para verificar que el usuario elimine los datos almacenados



Router.route('/verify/:uniqueString') //RECIBE EL LINK DE USUARIO
.get(verifyEmail) //LLAMA A FUNCION DE VERIFICACIION


Router.route('/auth/signUp') 
.post(validator, nuevoUsuario)


Router.route('/auth/signIn')
.post(accederACuenta)

Router.route('/auth/signOut')
.post(cerraSesion)

Router.route('/files/upload')
.post(uploadFile, getFiles)

Router.route('/files/fileList')
.post(getFiles)

Router.route('/files/delete:id')
.post(deleteFile)

module.exports = Router




