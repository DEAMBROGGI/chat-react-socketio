
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const Router = require('./routes/routes')
require('./config/database')
const passport = require('passport')
const app = express();

const { Server } = require("socket.io"); //requerimos la clase Server el paquete socket.io 

//middlewares

app.use(cors());
app.use(express.json());
app.use(passport.initialize())


const { getUserConected } = require('./controllers/usersConectedController');


app.use('/api', Router)

  
 let server = app.listen('4000',()=> console.log('Server listening on port 4000'))
 const io = new Server(server,{ cors: { origin: '*' } }) //creamos la constante io y le pasamos los atributos de server y cors
 
 
io.on('connect',  (socket) => {  // CONEXION PRIMARIA ENTRE EL SERVER Y NUESTRO IP LLAMADA DESDE APP
    console.log("Socket Connected")  
    
    socket.on('user list', async() => {         //ES LLAMADA HOME CUANDO EL USUARIO YA REALIZO SIGNIN
       console.log("change on chat list")
       

      await getUserConected()       //BUSCA EN LA DB LOS USUARIOS CONECTADOS
        .then(response=>{
          
            console.log(response)
        socket.emit('usersConected',{response}) //LO EMITE PARA TU SOCKET LO RECIBE EN "UsersConected"
        socket.broadcast.emit('usersConected', {response}) //LO EMITE PARA TODOS LOS SOCKETS "UsersConected"
        })
        
  
   
    });
   
  /*
    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id);
  
      io.to(user.room).emit('message', { user: user.name, text: message });
  
      callback();
    });
  
    socket.on('disconnect', () => {
      const user = removeUser(socket.id);
  
      if(user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
      }
    })*/
  });