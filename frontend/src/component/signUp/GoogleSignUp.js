import React from 'react';
import {useNavigate } from "react-router-dom";
import {useStateValue} from '../../core/StateProvider';
import {registrarUsuario} from '../../core/actions/userActions'
import GoogleLogin from 'react-google-login'
import {useStyles} from './styles'

export default function GoogleSignUp() {
const classes = useStyles();
const [{newUser},dispatch] = useStateValue();
  let navigate = useNavigate()

const responseGoogle = async (res) => {
  let googleUser = {
      firstName: res.profileObj.givenName,
      lastName: res.profileObj.familyName,
      email: res.profileObj.email,
      password: res.profileObj.googleId, 
      from:"google"
  }
  
   await registrarUsuario( googleUser, dispatch, navigate)
  
}

  return (  
            <GoogleLogin
                    className={classes.ButtonSignUp}
                    clientId="971845975096-a3gu832l2esbdv2dmp2iktvql4t5imot.apps.googleusercontent.com" 
                    buttonText="Sign Up with Google"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                    />
           
  );
}