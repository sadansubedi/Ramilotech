// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// export const userAuthApi = createApi({
//   reducerPath: 'userAuthApi',
//   baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/user/' }),
//   endpoints: (builder) => ({
//     registerUser: builder.mutation({
//         query :(user)=>{
//             return{
//                 url: 'register/',
//                 method: 'POST',
//                 body: user,
//                 headers :{
//                     'content-type': 'application/json',
//                 }
//             }
//         }
//     }),
//     getRegisterUser: builder.query({
//       query: (id) => {
//         return {
//           url: `getuser/${id}/`,
//           method: 'GET',
//         }
//       }
//     }),
//     loginUser: builder.mutation({
//       query :(user)=>{
//           return{
//               url: 'login/',
//               method: 'POST',
//               body: user,
//               headers :{
//                   'content-type': 'application/json',
//               }
//           }
//       }
//   }),
//   getLoggedUser: builder.query({
//     query: (access_token) => {
//       return {
//         url: 'profile/',
//         method: 'GET',
//         headers: {
//           'authorization': `Bearer ${access_token}`,
//         }
//       }
//     }
//   }),
  
//     changeUserPassword: builder.mutation({
//         query: ({ actualData, access_token }) => {
//         return {
//             url: 'changepassword/',
//             method: 'POST',
//             body: actualData,
//             headers: {
//             'authorization': `Bearer ${access_token}`,
//             }
//         }
//     }
//   }),
//   sendPasswordResetEmail: builder.mutation({
//     query: (user) => {
//       return {
//         url: 'send-reset-password-email/',
//         method: 'POST',
//         body: user,
//         headers: {
//           'Content-type': 'application/json',
//         }
//       }
//     }
//   }),
//   resetPassword: builder.mutation({
//     query: ({ actualData,id,token }) => {
//       return {
//         url: `/reset-password/${id}/${token}/`,
//         method: 'POST',
//         body: actualData,
//         headers: {
//           'Content-type': 'application/json',
//         }
//       }
//     }
//   }),
  
//   blogpost: builder.query({
//     query: () => {
//        return{
//       url: `/blogposts/`,
//       method: 'GET',
//     }
//   }
// }),
// createblogpost: builder.mutation({
//   query: (actualData) => {
//     // console.log(actualData)
//      return{
//     url: `/blogposts/`,
//     method: 'POST',
//     body: actualData,
//     headers: {
//       'Content-type': 'application/json',
//     }
//   }
// }
// }),
// updateBlogPost: builder.mutation({
//   query: ({ id, ...patch }) => ({
//     url: `/blogposts/${id}/`,
//     method: 'PUT',
//     body: patch,
//     headers: {
//       'Content-type': 'application/json',
//     },
//   }),
// }),
// // Mutation to delete a blog post
// deleteBlogPost: builder.mutation({
//   query: (id) => ({
//     url: `/blogposts/${id}/`,
//     method: 'DELETE',
//   }),
// }),
// createcategory: builder.mutation({
//   query: (actualData) => {
//     // console.log(actualData)
//      return{
//     url: `/categories/`,
//     method: 'POST',
//     body: actualData,
//     headers: {
//       'Content-type': 'application/json',
//     }
//   }
// }
// }),
// //get category works ok 
// getcategory: builder.query({
//   query: (id) => {
//      return{
//     url: `/categories/${id}/`,
//     method: 'GET',
//   }
// }
// }),
// createtags: builder.mutation({
//   query: (actualData) => {
//     // console.log(actualData)
//      return{
//     url: `/tags/`,
//     method: 'POST',
//     body: actualData,
//     headers: {
//       'Content-type': 'application/json',
//     }
//   }
// }
// }),
// gettags: builder.query({
//   query: (id) => {
//      return{
//     // url: `/tags/${id}/`,
//     // url: `/tags/${id.join(',')}/`,
//     url: `/tags/?id=${id.join(',')}`,
//     method: 'GET',
//   }
// }
// }),
  



//   })
// })

// export const { useRegisterUserMutation, useLoginUserMutation,useChangeUserPasswordMutation,
//   useSendPasswordResetEmailMutation,useResetPasswordMutation,useGetLoggedUserQuery,useBlogpostQuery,useCreateblogpostMutation,useUpdateBlogPostMutation,useDeleteBlogPostMutation
// ,useGetRegisterUserQuery,useCreatecategoryMutation,useGetcategoryQuery,useCreatetagsMutation,useGettagsQuery} = userAuthApi






import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://127.0.0.1:8000/api/user/',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('access_token'); // Adjust the path to where your token is stored
    // console.log(token)
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const userAuthApi = createApi({
  reducerPath: 'userAuthApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (user) => ({
        url: 'register/',
        method: 'POST',
        body: user,
        headers: {
          'content-type': 'application/json',
        },
      }),
    }),
    getRegisterUser: builder.query({
      query: (id) => ({
        url: `getuser/${id}/`,
        method: 'GET',
      }),
    }),
    loginUser: builder.mutation({
      query: (user) => ({
        url: 'login/',
        method: 'POST',
        body: user,
        headers: {
          'content-type': 'application/json',
        },
      }),
    }),
    getLoggedUser: builder.query({
      query: () => ({
        url: 'profile/',
        method: 'GET',
      }),
    }),
    changeUserPassword: builder.mutation({
      query: ({ actualData }) => ({
        url: 'changepassword/',
        method: 'POST',
        body: actualData,
      }),
    }),
    sendPasswordResetEmail: builder.mutation({
      query: (user) => ({
        url: 'send-reset-password-email/',
        method: 'POST',
        body: user,
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ actualData, id, token }) => ({
        url: `/reset-password/${id}/${token}/`,
        method: 'POST',
        body: actualData,
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    blogpost: builder.query({
      query: () => ({
        url: '/blogposts/',
        method: 'GET',
      }),
    }),
    createblogpost: builder.mutation({
      query: (actualData) => ({
        url: '/blogposts/',
        method: 'POST',
        body: actualData,
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    updateBlogPost: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/blogposts/${id}/`,
        method: 'PUT',
        body: patch,
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    deleteBlogPost: builder.mutation({
      query: (id) => ({
        url: `/blogposts/${id}/`,
        method: 'DELETE',
      }),
    }),
    createcategory: builder.mutation({
      query: (actualData) => ({
        url: '/categories/',
        method: 'POST',
        body: actualData,
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    getcategory: builder.query({
      query: (id) => ({
        url: `/categories/${id}/`,
        method: 'GET',
      }),
    }),
    createtags: builder.mutation({
      query: (actualData) => ({
        url: '/tags/',
        method: 'POST',
        body: actualData,
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    gettags: builder.query({
      query: (id) => ({
        url: `/tags/?id=${id.join(',')}`,
        method: 'GET',
      }),
    }),
    getComments: builder.query({
      // query: (id) => ({
      //   url: `/comments/${id}/`,
      //   method: 'GET',
      // }),
      query: (postId) => ({
        url: `comments/?post_id=${postId}`,
        method: 'GET',
      }),
    }),
    addComment: builder.mutation({
      query: (comment) => ({
        url: 'comments/',
        method: 'POST',
        body: comment,
        headers: {
          // Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-type': 'application/json',
        },
      }),
    }),
    
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useChangeUserPasswordMutation,
  useSendPasswordResetEmailMutation,
  useResetPasswordMutation,
  useGetLoggedUserQuery,
  useBlogpostQuery,
  useCreateblogpostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
  useGetRegisterUserQuery,
  useCreatecategoryMutation,
  useGetcategoryQuery,
  useCreatetagsMutation,
  useGettagsQuery,
  useAddCommentMutation,
  useGetCommentsQuery,
  
} = userAuthApi;
