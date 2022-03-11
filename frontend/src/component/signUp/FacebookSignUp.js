import React from 'react';
import {useNavigate } from "react-router-dom";
import {useStateValue} from '../../core/StateProvider';
import {registrarUsuario} from '../../core/actions/userActions'
import FacebookLogin from 'react-facebook-login';
import {useStyles} from './styles'

export default function FacebookSignUp() {
const classes = useStyles();
const [{newUser},dispatch] = useStateValue();
  let navigate = useNavigate()

const responseFacebook = async (res) => {
    console.log(res)
  let facebookUser = {
      firstName: res.name,
      lastName: "facebook",
      email: res.email,
      password: res.id, 
      from:"facebook"
  }
  
   await registrarUsuario( facebookUser, dispatch, navigate)
  
}

  return (  
    <FacebookLogin
    
    appId="477750107157342"
    autoLoad={false}
    fields="name,email,picture"
    callback={responseFacebook}
  
  />
           
  );
}