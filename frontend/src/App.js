import '../src/styles/App.css';
import React,{useEffect} from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import SignIn from '../src/component/SignIn'
import SignUp from '../src/component/SignUp'
import Home from '../src/component/Home'
import {useStateValue} from '../src/core/StateProvider';
import {actionTypes} from '../src/core/reducer';
function App() {
 
  const [{Auth},dispatch] = useStateValue();


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
      
        {!Auth ? <Route path='/' element={<SignIn/>}/> : <Route path='/home' element={<Home/>}/> }
        {!Auth ? <Route path='/signup' element={<SignUp/>}/> : <Route path='/signup' element={<SignUp/>}/>}
        {Auth ? <Route path='/home' element={<Home/>}/> : <Route path='/signup' element={<SignUp/>} />}
        {Auth && <Route path="*" element={<Home />} />}
        <Route path='/verify/:uniqueString' element={<Home/>}/>
    </Routes>
    </BrowserRouter> 
  );
}

export default App;