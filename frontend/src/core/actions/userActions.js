import axios from 'axios'
import {actionTypes} from '../reducer';
 

  export const registrarUsuario = async (newUser, dispatch, navigate) =>{

            try {
                // eslint-disable-next-line
                const user = await axios.post('http://localhost:5000/api/auth/signUp',
                {newUser})
                
                  dispatch({
                    type:actionTypes.SNACKBAR,
                    snackbar:{
                      view:true,
                      message:user.data.message,
                      success: user.data.success
                    }  
                    }); 
                    
                       
            }catch(error){
                console.log(error)
            }
        }
    ;

   export const cerraSesion = async(closeuser)=>{
   
       const user = axios.post('http://localhost:5000/api/auth/signOut',{closeuser})
                    localStorage.removeItem('token')
                   

   } 
   export const  iniciarSesion = async(logedUser, dispatch, navigate) => {

            try {
                const user = await axios.post('http://localhost:5000/api/auth/signIn',
                {logedUser})
console.log(user)
                
                dispatch({
                    type:actionTypes.SNACKBAR,
                    snackbar:{
                      view:true,
                      message:user.data.message,
                      success: user.data.success
                    }  
                    });
                    if(user.data.success){
                    dispatch({
                        type: actionTypes.ADD_LOGEDUSER,
                        logedUser:user.data.response
                    })    
                    
                    localStorage.setItem('token',user.data.response.token)
                    navigate('/home')
                }
                /*if(user.data.success && !user.data.error){
                    localStorage.setItem('token',user.data.response.token)
                    localStorage.setItem('userConected', JSON.stringify(user.data.response.userData))
                    return {success:true, user}
                }else{ return ({sucess:user.data.success, response:user})}*/
                    /*if(logedUser.google){
                        return {success:false, response:"You have to sign up before you log in"}

                    }else{
                    
                    return {user}
                    
                    }
                }*/
            }catch(error){
                console.log(error)
            }
        
    }

    

