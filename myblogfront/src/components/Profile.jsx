import React from 'react'
import { useGetLoggedUserQuery } from "../services/userAuthApi";
import { getToken,removeToken } from "../services/LocalStorageService";
const Profile = () => {
    const {access_token}= getToken();
   const { data, isSuccess } = useGetLoggedUserQuery(access_token)
  console.log(data, isSuccess)
  return (
    <>
   {data ? 
   <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
   <div className="px-6 py-4">
     <div className="font-bold text-xl mb-2">Profile Details</div>
     <div className="mb-2">
       <h1 className="text-gray-700">Profile ID: {data.id}</h1>
       <h1 className="text-gray-700">Profile Name: {data.name}</h1>
       <h1 className="text-gray-700">Profile Email: {data.email}</h1>
     </div>
   </div>
 

 </div>
:"" 
   }
    </>
  )
}

export default Profile