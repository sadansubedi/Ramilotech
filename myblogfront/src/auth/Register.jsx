import React, { useState } from 'react';
import {NavLink,useNavigate} from "react-router-dom"
import { useRegisterUserMutation } from '../services/userAuthApi';

const Register = () => {
const [server_error, setServerError] = useState({});
const navigate = useNavigate();

const [registerUser,{isLoading}]= useRegisterUserMutation();
// const data= useRegisterUserMutation();
// console.log(data);
const handleSubmit = async(e) => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const actualData = {
    name: data.get('name'),
    email: data.get('email'),
    password: data.get('password'),
    password2: data.get('password2'),
    // tc: data.get('tc'),//for checkbox
  }
  const res = await registerUser(actualData);
  console.log(res);
  if(res.error){
    // console.log(res.error);
    // console.log(res.error.data.errors);
    // console.log(typeof(res.error.data.errors));
    setServerError(res.error.data.errors);
  }
  if(res.data){
  //  console.log(res.data);
    // storeToken(res.data.token);
    navigate('/login');
  }

}

  return (
    <>
     {server_error.non_field_errors ? console.log(server_error.non_field_errors[0]) : ''}
    <div className="max-w-md mx-auto mt-8 border-cyan-600">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form id='registration-form' onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-gray-700">Username</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Username"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
          {server_error.name ?  <div className= 'text-red-700'>
              { server_error.name[0]}</div> : ''
              }
        </div>
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
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="password2"
            name="password2"
            placeholder="confirm password"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
          {server_error.password2 ?  <div className= 'text-red-700'>
              { server_error.password2[0]}</div> : ''
              }
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Register
          </button>
        </div>
      </form>
      {server_error.non_field_errors ?  <div className= 'text-red-700'>
              { server_error.non_field_errors[0]}</div> : ''
              }
    </div>
    </>
  );
};

export default Register;
