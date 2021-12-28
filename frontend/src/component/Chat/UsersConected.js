import React,{useEffect} from 'react';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Badge from '@mui/material/Badge';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import {useStateValue} from '../../core/StateProvider';
import {actionTypes} from '../../core/reducer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

export default function UsersConected({userConected}) {

  const [{socket,userList},dispatch] = useStateValue();  
  const [open, setOpen] = React.useState(false);
  console.log(userConected)
useEffect(() => {

    socket.on('usersConected', ({response}) => { //RECIBE EL EMIT Y EL PARAMETRO
     
        console.log("change on chat list")
         dispatch({
            type:actionTypes.USER_LIST,  //LO COLOCA DE MANERA GLOBAL PARA RENDERIZARLO
            userList:response.user
        }) 
    }
    );
  }, []) 

  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }  


  const handleOpen = () => {
    open ? setOpen(false) : setOpen(true) 
};
  return (
    <div>
      <Button
     
        onClick={handleOpen}
      >
         <Badge badgeContent={userList.length} color="error">
         <ChatBubbleOutlineRoundedIcon sx={{color:"white"}}/>
          </Badge>
      </Button>
      
      <List dense sx={{position:'absolute',
                       top:"80px", 
                       right:"10px", 
                       width: 'auto', 
                       boxShadow:3,
                       bgcolor: 'background.paper' }}>
      {open && userList?.map((value) => {
         /* let name;
        if(value.email === userConected.email){
             name = "YOU" 
        }else{  name = value.firstName+" "+value.lastName}*/
        return (
            
          <ListItem
            key={value._id}
            
            disablePadding
          >
            <ListItemButton>
              <ListItemAvatar>
                <Avatar
                  {...stringAvatar(value.firstName+" "+value.lastName)}
                  
                />
              </ListItemAvatar>
              <ListItemText sx={{color:"black"}}  primary={value.firstName+" "+value.lastName}  />
            </ListItemButton>
          </ListItem>
          
        );
      })}
    </List>
   
    </div>
  );
}