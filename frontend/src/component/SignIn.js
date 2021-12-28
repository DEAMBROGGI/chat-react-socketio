import React,{useState, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Link as RouterLink } from "react-router-dom";
import {useStateValue} from '../core/StateProvider';
import {actionTypes} from '../core/reducer';
import {iniciarSesion} from '../core/actions/userActions'
import { GoogleLogin } from 'react-google-login'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © MindHub.LA '}
      <Link color="inherit" href="https://mindhubweb.com/">
        mindhubweb.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  googleButton:{
    width:'100%',
    display:'flex',
    justifyContent:'center',
    marginBottom:"8px"
  }
}));

export default function SignIn() {

  const classes = useStyles();
  const [{logedUser},dispatch] = useStateValue();
  const [userData, setUserData] = useState({
    
    email:'',
    password:''
})



const responseGoogle = async  res => {
   //TOMAMOS LA RESPUESTA GOOGLE
   let logGoogleUser = {
      email: res.profileObj.email,
      password: res.profileObj.googleId,
      google:true
}

  await iniciarSesion(logGoogleUser)

  .then((response ) => {

       if(response.success) {
       dispatch({
        type:actionTypes.SNACKBAR,
        snackbar:{
          view:true,
          message:"Welcome back "+response.user.data.response.userData.firstName,
          success: true},
      });
      dispatch({
        type:actionTypes.AUTH,
        Auth:true
        });
                      
    }else{
      dispatch({
      type:actionTypes.SNACKBAR,
      snackbar:{
        view:true,
        message:response.response.data.error,
        success: false},
    })      
  }

  })
  .catch((error) => {
      console.log(error)
     
  })
}

const handleInputChange = (event) => {
    setUserData({
        ...userData,
        [event.target.name] : event.target.value
    })
}
  const handleSubmit= async (event)=>{
    event.preventDefault()
   await iniciarSesion(userData)
   .then(  response =>{
  
     if(!response.user){
   
  dispatch({
        type:actionTypes.SNACKBAR,
        snackbar:{
          view:true,
          message:response.response.data.error,
          success: false},
      })

     }else{
      dispatch({
        type:actionTypes.SNACKBAR,
        snackbar:{
          view:true,
          message:"Welcome back "+ response.user.data.response.userData.firstName,
          success: true},
      });
      dispatch({
        type:actionTypes.AUTH,
        Auth:true
        })     
     }
    
    
   }).catch((error) => {
    console.log(error)
    
       
})

        await dispatch({
            type: actionTypes.ADD_LOGEDUSER,
            logedUser:userData
        })
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container sx={{width:"100%"}}>
            <GoogleLogin
                    className={classes.googleButton}
                    clientId="971845975096-a3gu832l2esbdv2dmp2iktvql4t5imot.apps.googleusercontent.com" 
                    buttonText="Log in with Google"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                    />
            </Grid>        
          <Grid container>
            
            <Grid item xs>
              {/*<Link href="#" variant="body2">
                Forgot password?
                </Link>*/}
            </Grid>
            <Grid item>
              <RouterLink to="/signup" variant="body2">
                "Don't have an account? Sign Up"
              </RouterLink>
            </Grid>
            
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}