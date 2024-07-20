import React from 'react'
import { useGetRegisterUserQuery } from '../services/userAuthApi';

const Author = (props) => {
    // console.log(props)
    // const {authorId}= props
    // console.log(authorId)
  const { data, isSuccess, isLoading } = useGetRegisterUserQuery(props.data);
  // const { data, isSuccess, isLoading } = useGetRegisterUserQuery(authorId);
  console.log(data)

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isSuccess || !data) {
    return <div>No data found</div>;
  }

  return (
    <>
    <h1>Author: {data.name}</h1>
    </>
  )
}

export default Author