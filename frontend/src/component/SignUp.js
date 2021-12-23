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
import {Link as RouterLink, useNavigate } from "react-router-dom";
import {useStateValue} from '../core/StateProvider';
import {actionTypes} from '../core/reducer';
import {registrarUsuario} from '../core/actions/userActions'
import GoogleLogin from 'react-google-login'

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
    marginTop: theme.spacing(3),
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

export default function SignUp() {
  const classes = useStyles();
  const [{newUser},dispatch] = useStateValue();
  let navigate = useNavigate()

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email:'',
    password:''
})


const responseGoogle = async (res) => {
  let googleUser = {
      firstName: res.profileObj.givenName,
      lastName: res.profileObj.familyName,
      email: res.profileObj.email,
      password: res.profileObj.googleId, 
      google:true
  }
  
   await registrarUsuario( googleUser)
  .then((response) => {
 
      if(response.success){
      dispatch({
        type:actionTypes.SNACKBAR,
        snackbar:{
          view:true,
          message:response.message,
          success: response.success},   
        });
          navigate('/')
        
      }else{
        dispatch({
          type:actionTypes.SNACKBAR,
          snackbar:{
            view:true,
            message:response.response.response,
            success: response.response.success},   
          });
          ;
           
            navigate('/')
      }
 
  })
  .catch((error) => {
      console.log(error)
      alert('Something went wrong! Come back later!')
        
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

   await registrarUsuario(userData)
   
    .then(response=>{
      if(!response.success){
       if(response.response.error === undefined){
          dispatch({
            type:actionTypes.SNACKBAR,
            snackbar:{
              view:true,
              message:response.response.message,
              success: false},   
            })  
        }else{
         
          dispatch({
            type:actionTypes.SNACKBAR,
            snackbar:{
              view:true,
              message:response.response.error.details.map((item,index)=> <li key={index}>{item.message}</li>),
              success: false},
            })  
        }
      }else{dispatch({
        type:actionTypes.SNACKBAR,
        snackbar:{
          view:true,
          message:response.response.message,
          success:true},
        });
          navigate('/')
      }
    
    })

        await dispatch({
            type: actionTypes.ADD_NEWUSER,
            newUser:userData
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
          Sign up
        </Typography>
        <form className={classes.form}  onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                onChange={handleInputChange}
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                onChange={handleInputChange}
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={handleInputChange}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={handleInputChange}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            
          >
            Sign Up
          </Button>
          <Grid container sx={{width:"100%"}}>
            <GoogleLogin
                    className={classes.googleButton}
                    clientId="971845975096-a3gu832l2esbdv2dmp2iktvql4t5imot.apps.googleusercontent.com" 
                    buttonText="Sign Up with Google"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                    />
            </Grid>        
          <Grid container justifyContent="flex-end">
            <Grid item>
            <RouterLink  to="/" variant="body2">
                Already have an account? Sign in
              </RouterLink>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}