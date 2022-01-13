import '../src/styles/App.css';
import React,{useEffect} from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import SignIn from '../src/component/SignIn'
import SignUp from '../src/component/SignUp'
import Home from '../src/component/Home'
import {useStateValue} from '../src/core/StateProvider';
import {actionTypes} from '../src/core/reducer';
import io from "socket.io-client";

function App() {
  
  const [{Auth},dispatch] = useStateValue();
  
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
    
  }, [Auth])
 
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/signIn' element={<SignIn/>}/>
        {!Auth ? <Route path='/' element={<SignIn/>}/> : <Route path='/home' element={<Home/>}/> }
        {!Auth ? <Route path='/signup' element={<SignUp/>}/> : <Route path='/signup' element={<SignUp/>}/>}
        {Auth ? <Route path='/home' element={<Home/>}/> : <Route path='/signup' element={<SignUp/>} />}
        {Auth && <Route path="*" element={<Home />} />}
        <Route path='/verify/:uniqueString' element={<SignIn/>}/>
    </Routes>
    </BrowserRouter> 
  );
}

export default App;