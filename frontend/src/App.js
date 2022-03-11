import '../src/styles/App.css';
import React,{useEffect} from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import SignIn from '../src/component/SignIn'
import SignUp from './component/signUp/SignUp'
import Home from '../src/component/Home'
import {useStateValue} from '../src/core/StateProvider';
import {actionTypes} from '../src/core/reducer';
import io from "socket.io-client";

function App() {
  
  const [{Auth, logedUser},dispatch] = useStateValue();
  
  useEffect(() => {
const socket = io.connect("http://localhost:5000");  //REALIZA LA LLAMAD A CONNECT PARA INICIALIZAR EL SOCKET
    dispatch({
      type:actionTypes.SOCKET, //COLOCAMOS EL SOQUET DE MANERA GLOBAL
      socket:socket
    }) 
  }, [])
  useEffect(() => {
 
    if(localStorage.getItem('token')!== null){
      dispatch({
        type:actionTypes.AUTH,
        Auth:true
      })
      
    }
    
  }, [logedUser])
 
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/signIn' element={<SignIn/>}/>
        {/*!logedUser ? <Route path='/' element={<SignIn/>}/> : <Route path='/home' element={<Home/>}/> */}
         <Route path='/' element={<SignUp/>}/> 
        {logedUser ? <Route path='/home' element={<Home/>}/> : <Route path='/signup' element={<SignUp/>} />}
        {logedUser && <Route path="*" element={<Home />} />}
        <Route path='/verify/:uniqueString' element={<SignIn/>}/>
    </Routes>
    </BrowserRouter> 
  );
}

export default App;