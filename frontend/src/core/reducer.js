export const initialState = {
    newUser:false,
    logedUser:[],
    snackbar:{view: false,
             message: '',
             success:false},
    Auth:false,
    
}

export const actionTypes = {
    ADD_NEWUSER:"ADD_NEWUSER",
    ADD_LOGEDUSER:"ADD_LOGEDUSER",
    SNACKBAR:"SNACKBAR",
    AUTH:"AUTH",
    USER_CONECTED:"USER_CONECTED"
}

const reducer =(state, action ) =>{

    console.log(action);

switch(action.type){
    
    case "ADD_NEWUSER":
        return{
            ...state,
            newUser: action.newUser
        }
    case "ADD_LOGEDUSER":
        return{
            ...state,
            logedUser: action.logedUser
            }
    case "ADD_USER_CONECTED":
        return{
            ...state,
            userConected: action.userConected
                }
    case "AUTH":
        return{
        ...state,
        Auth: action.Auth
            }  
    case "SNACKBAR":
         return{
             ...state,
             snackbar:action.snackbar,
             
            }                                                                              
    default: return state;
}
}
export default reducer