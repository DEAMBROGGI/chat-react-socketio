import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import {useStateValue} from '../core/StateProvider';
//material ui
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { actionTypes } from '../core/reducer';
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@material-ui/core/styles';





function Snack() {

  const [{snackbar},dispatch] = useStateValue();

  

  const useStyles = makeStyles(theme => ({
    icon: {
      marginLeft: '15px'
    }
  }));
  
   const MySnackbar = styled(Snackbar)({
    backgroundColor: snackbar.success ? 'green': 'red',
    color: '#fff',
    borderRadius: '4px',
    padding: '6px 16px',
    fontWeight: '400',
    lineHeight: '1.43',
    letterSpacing: '0.01071em',
  });

  const classes = useStyles();

  const handleClose = () => {
    dispatch({
      type:actionTypes.SNACKBAR,
      snackbar:{
          view: false,
          message: '',
        success:false}
    
    });
  };

  return (
    <div>
      {snackbar.view === true && (
        <MySnackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={snackbar.view}
          onClose={handleClose}
          autoHideDuration={5000}
       > 
        <>
          <p>
            {snackbar.message}
          </p>
          <IconButton className={classes.icon} size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
        </MySnackbar>
      )}
      
    </div>
  );
}


export default Snack