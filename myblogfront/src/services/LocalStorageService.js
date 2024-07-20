const storeToken =(value)=>{
    if(value){
        const {access,refresh,accessExpiresIn} = value;
        localStorage.setItem('access_token',access);
        localStorage.setItem('refresh_token',refresh);
    
    }
}

const getToken= ()=>{
    let access_token  = localStorage.getItem('access_token');
    let refresh_token  = localStorage.getItem('refresh_token');
    return {access_token,refresh_token}
}

const removeToken = ()=>{
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access_expires_in'); // Remove stored expiry time
}
// const isAuthenticated = () => {
//     const { access_token } = getToken();
//     return !!access_token;
//   };
  

export {storeToken,getToken,removeToken}//isAuthenticated