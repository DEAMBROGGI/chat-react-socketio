import axios from 'axios'

 

  export const registrarUsuario = async (newUser) =>{

            try {
                // eslint-disable-next-line
                const user = await axios.post('http://localhost:5000/api/auth/signUp',
                {newUser})
                if(user.data.success && !user.data.error){
                    localStorage.setItem('token',user.data.response.token)
                    return {success:true, response:user.data}
                }else{

                    return {success:false, response:user.data.response}
                }
            }catch(error){
                console.log(error)
            }
        }
    ;

   export const cerraSesion = async(closeuser)=>{
       const user = axios.post('http://localhost:5000/api/auth/signOut',{closeuser})
                    localStorage.removeItem('token')
                    localStorage.removeItem('userConected')

   } 
   export const  iniciarSesion = async(logedUser) => {
   
            try {
                const user = await axios.post('http://localhost:5000/api/auth/signIn',
                {logedUser})
                if(user.data.success && !user.data.error){
                    localStorage.setItem('token',user.data.response.token)
                    localStorage.setItem('userConected', JSON.stringify(user.data.response.userData))
                    return {success:true, user}
                }else{ return ({sucess:user.data.success, response:user})}
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

    

