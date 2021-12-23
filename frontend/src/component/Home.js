import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {actionTypes} from '../core/reducer';
import {useStateValue} from '../core/StateProvider';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default  function MenuAppBar() {
  const classes = useStyles();
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [{Auth,},dispatch] = useStateValue();

  const dataUserConected =  localStorage.getItem('userConected')
  const userConected = JSON.parse(dataUserConected)
  console.log(userConected)

  const SignOut =()=>{
      localStorage.removeItem('token')
      localStorage.removeItem('userConected')
      dispatch({
        type:actionTypes.AUTH,
        Auth:false
        })    
        
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      
      <AppBar >
        <Toolbar >
        <Typography variant="h6" className={classes.title}>
            Hello {/*userConected.firstName*/}
        </Typography>
            <div>
                
              <IconButton
               
                rigth='0px'
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={SignOut}>SignOut</MenuItem>
              </Menu>
            </div>
          
        </Toolbar>
      </AppBar>
    </div>
  );
}
