import React,{ useState,useEffect,useRef} from 'react';
import { getToken,removeToken } from "../services/LocalStorageService";
import { useDispatch } from "react-redux";
import { NavLink,useNavigate } from 'react-router-dom';
import { unsetUserToken } from "../features/authSlice";
import { useGetLoggedUserQuery } from "../services/userAuthApi";
import { setUserInfo} from "../features/userSlice";
import Dropdown from './Dropdown';
const Navbar = () => {
  const {access_token}= getToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();
   const { data, isSuccess } = useGetLoggedUserQuery(access_token)
  // console.log(data, isSuccess)

  

    // const [userData, setUserData] = useState({
    //   email: "",
    //   name: ""
    // })
    useEffect(() => {
      // if (data && isSuccess) { //i thought useless to dispatch so commented 
      //   setUserData({
      //     email: data.email,
      //     name: data.name,
      //   })
      // }else{
      //   dispatch(unsetUserToken({ access_token: null }));
      //  removeToken();
      // }
      
      if(!data){
        dispatch(unsetUserToken({ access_token: null }));
       removeToken();
      }
    }, [data, isSuccess])
  
   const [open,setopen] = useState(false);
  const dropdownRef = useRef(null);
  // Store User Data in Redux Store optional if you want to show in other component for that we store in redux so that we can use whereever we want (video : get logged userdata)

  useEffect(() => {
    //i thought it is useless to dispatch so commented ok
    // if (data && isSuccess) {
    //   dispatch(setUserInfo({
    //     email: data.email,
    //     name: data.name
    //   }))
    // }else{
    //   dispatch(unsetUserToken({ access_token: null }));
    //  removeToken();
    // }
    
    function handleClickOutside(event) {//closing a dropdown when user click outside 
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setopen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

   
  }, [data, isSuccess, dispatch,dropdownRef]);

  const toggleDropdown = (event) => {
    event.preventDefault(); // Prevent the default behavior of NavLink
    setopen(!open);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold">My Website</div>
        <ul className="flex space-x-4">
          <NavLink to="/" className="text-white hover:text-gray-300">Home</NavLink>
          <NavLink to="/blog" className="text-white hover:text-gray-300">Blog</NavLink>
          <NavLink to="#" className="text-white hover:text-gray-300">Contact</NavLink>
         
          <div ref={dropdownRef}>
             {access_token ?
          <NavLink className="text-white hover:text-gray-300" onClick={toggleDropdown}>Profile {open ? <Dropdown />:""}
            </NavLink>
           
            :
          <NavLink to="/login" className="text-white hover:text-gray-300">login</NavLink>
          }  
          </div>

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
