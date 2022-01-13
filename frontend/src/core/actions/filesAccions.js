import axios from 'axios'

export const getFiles = async (email) =>{

    
    try {
        // eslint-disable-next-line
        const user = await axios.post('http://localhost:5000/api/files/fileList',
        {email})
       
        if(user.data.success && !user.data.error){
            
            return {success:true, user}
        }else{

            return {success:false, response:user.data.response}
        }
    }catch(error){
        console.log(error)
    }
}
;


  export const uploadFile = async(formData) =>{

            try {
                // eslint-disable-next-line
                const user = await axios.post('http://localhost:5000/api/files/upload',
                formData)
                
                if(user.data.success && !user.data.error){
                    
                    return {success:true}
                }else{ 

                    return {success:false}
                }
            }catch(error){
                console.log(error)
            }
        }
    ;

   
   export const  deleteFile = async(id,email) => {
   
            try {
                const user = await axios.post('http://localhost:5000/api/files/delete'+id,{email}
                )
                if(user.data.success && !user.data.error){
                    
                    return {success:true, response:user.data}
                }else{

                    return {success:false, response:user.data.response}
                }
            }catch(error){
                console.log(error)
            }
        }
    

    