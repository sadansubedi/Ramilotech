
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useBlogpostQuery } from '../services/userAuthApi';
// import CategoryInput from './Category';
// import Tags from './Tags';
// import Author from './Author';
// import { getToken } from "../services/LocalStorageService";

// const Profile = () => {
//   const { access_token } = getToken();
//   const { data, refetch, isSuccess, isLoading } = useBlogpostQuery();
//   const navigate = useNavigate();
//   const location = useLocation();
//   // const [childProps, setChildProps] = useState(location.state?.post || null);

//   // useEffect(() => {
//   //   refetch();
//   // }, [childProps, refetch]);
//   useEffect(() => {
//     refetch();
//   }, [refetch]);

//   const handleClick = (post) => {
//     // console.log(post) // here post contain all data like id,title,content,tag,category ok
//     // setChildProps(post);
//     navigate('/blog', { state: { post } });
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!isSuccess || !data) {
//     return <div>No data found</div>;
//   }

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   return (
//     <div className="container mx-auto py-8 flex flex-col items-center">
//       {data.map((post) => (
//         <div key={post.id} className="max-w-sm rounded overflow-hidden shadow-lg bg-white mb-4 flex flex-col">
//           <div className="px-6 py-4">
//             <div className="font-bold text-xl mb-2">Profile Details</div>
//             <div className="mb-2">
//               <h1 className="text-gray-700">Profile id: {post.id}</h1>
//               <h1 className="text-gray-700">Profile Title: {post.title}</h1>
//               <h1 className="text-gray-700">Profile Content: {post.content}</h1>
//               <h1 className="text-gray-700">Creation Date: {formatDate(post.creation_date)}</h1>
//               <h1 className="text-gray-700"><Author data={post.author} /></h1>
//               <h1 className="text-gray-700"><CategoryInput data={post.category} /></h1>
//               <h1 className="text-gray-700"><Tags data={post.tags} /></h1>
//             </div>
//           </div>
//           {access_token && (
//             <div className="flex justify-between px-6 py-1">
//               <button
//                 type="button"
//                 onClick={() => handleClick(post)}
//                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded focus:outline-none focus:shadow-outline"
//               >
//                 Edit
//               </button>
//               <button
//                 type="submit"
//                 className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//               >
//                 Delete
//               </button>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Profile;

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBlogpostQuery, useGetLoggedUserQuery,useDeleteBlogPostMutation,useGetCommentsQuery } from '../services/userAuthApi';
import CategoryInput from './Category';
import Tags from './Tags';
import Author from './Author';
// import CommentForm from './Comment';
import CommentForm from './Comment';
import { getToken } from "../services/LocalStorageService";
import GetComments from './Getcomment';
import CommentSection from './Comment';

const Profile = () => {
  const { access_token } = getToken();
  const { data: userData } = useGetLoggedUserQuery(access_token);
  // console.log(userData)
  
  const [deleteBlogpost] = useDeleteBlogPostMutation();
  // const { data: comments, error, isLoading :iscommenting} = useGetCommentsQuery(postId);
  
  const { data, refetch, isSuccess, isLoading } = useBlogpostQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const [childProps, setChildProps] = useState(location.state?.post || null);

  useEffect(() => {
    refetch();
  }, [childProps, refetch]);

  const handleClick = (post) => {
    setChildProps(post);
    navigate('/blog', { state: { post } });
  };

const handleDelete = async (postId) => {
    await deleteBlogpost(postId);
    refetch();
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isSuccess || !data) {
    return <div>No data found</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      {data.map((post) => (
        <div key={post.id} className="max-w-sm rounded overflow-hidden shadow-lg bg-white mb-4 flex flex-col">
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Profile Details</div>
            <div className="mb-2">
              {/* <h1 className="text-gray-700">Profile id: {post.id}</h1> */}
              <h1 className="text-gray-700">Profile Title: {post.title}</h1>
              <h1 className="text-gray-700">Profile Content: {post.content}</h1>
              <h1 className="text-gray-700">Creation Date: {formatDate(post.creation_date)}</h1>
              <h1 className="text-gray-700"><Author data={post.author} /></h1>
              <h1 className="text-gray-700"><CategoryInput data={post.category} /></h1>
              <h1 className="text-gray-700"><Tags data={post.tags} /></h1>
            </div>
          </div>
          {access_token && userData && post.author === userData.id && (
            <div className="flex justify-between px-6 py-1">
              <button
                type="button"
                onClick={() => handleClick(post)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded focus:outline-none focus:shadow-outline"
              >
                Edit
              </button>
              <button
                type="submit"
                onClick={() => handleDelete(post.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Delete
              </button>
            </div>

          )}
          <div className="px-6 py-4">
            <h2 className="font-bold text-lg mb-2">Comments</h2>
            {/* <CommentForm post={post} parentId={null} userData={userData} /> */}
            {/* <GetComments postId={post.id}/> */}
            <CommentSection post={post}/>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Profile;
