import React, { useState,useEffect } from 'react';
import { NavLink,  useNavigate } from "react-router-dom";
import { useLoginUserMutation } from '../services/userAuthApi';
import { getToken,removeToken, storeToken } from '../services/LocalStorageService';
import { useDispatch } from "react-redux";
import { setUserToken, unsetUserToken  } from '../features/authSlice';

const Login = () => {

const [server_error, setServerError] = useState({});
const navigate = useNavigate();
const [loginUser,{isLoading}]= useLoginUserMutation();
const dispatch = useDispatch();

const handleSubmit = async(e) => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const actualData = {
    email: data.get('email'),
    password: data.get('password'),
  }
  const res = await loginUser(actualData);
  // console.log(res);
  if(res.error){
  console.log(res.error.data.errors);
    setServerError(res.error.data.errors);
  }  else if(res.data){
    storeToken(res.data.token);
    let {access_token}= getToken();
     dispatch(setUserToken({access_token :access_token}))// it is set in reducer (authSlice.js)
    navigate('/blog');
   }
}
  
let {access_token}= getToken();

useEffect(()=>{
  dispatch(setUserToken({access_token :access_token}))// it is set in reducer (authSlice.js)
},[access_token,dispatch])

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form id='login-form' onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
          {server_error.email ?  <div className= 'text-red-700'>
              { server_error.email[0]}</div> : ''
              }
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
          {server_error.password ?  <div className= 'text-red-700'>
              { server_error.password[0]}</div> : ''
              }
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </div>
      </form>
      {server_error.non_field_errors ?  <div className= 'text-red-700'>
              { server_error.non_field_errors[0]}</div> : ''
              }
      <NavLink
            to='/sendpasswordresetemail'
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Forgot Password?
          </NavLink>
      <NavLink
            to='/register'
            className="text-blue-600 hover:underline focus:outline-none pl-8"
          >
            Register here
          </NavLink>
    </div>
  );
};

export default Login;
