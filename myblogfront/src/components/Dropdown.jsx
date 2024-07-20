import React, { useState } from 'react'
import { useDispatch } from "react-redux";
import { unsetUserToken } from "../features/authSlice";
import { getToken,removeToken } from "../services/LocalStorageService";
import { NavLink} from "react-router-dom";
// import Changepassword from '../auth/Changepassword';
// import Profile from './Profile';
const Dropdown = () => {
   
    const [open,setopen] = useState(false);
const dispatch = useDispatch();
const {access_token}= getToken();

const handleLogout = () => {
    dispatch(unsetUserToken({ access_token: null }));
    removeToken();
    // console.log('user logout');
    // navigate('/login');
  }
  return (
  <>
            <div className=' text-black '>
            <ul className='absolute bg-gray-50 shadow-lg rounded-2xl  right-2 m-3 p-4'>
              <NavLink to='/profile' className='p-2 mb-4 text-lg cursor-pointer'>Profile Details</NavLink> <hr className='py-1' />
              <NavLink className='p-2 mb-4 text-lg cursor-pointer' to="/changepassword">Change Password</NavLink><hr className='py-1'/>
              <NavLink className='p-2 mb-4 text-lg cursor-pointer' onClick={handleLogout}>Logout</NavLink>
            </ul>
        </div>
    </>
    )
}

export default Dropdown