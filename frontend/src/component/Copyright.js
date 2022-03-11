import React,{useState} from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';


export default function Copyright() {

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

