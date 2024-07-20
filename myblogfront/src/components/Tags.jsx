import React, { useState } from 'react';
import { useGettagsQuery } from '../services/userAuthApi';


function Tags(props) {
  // console.log(props.data)
  const [selectedCategory, setSelectedCategory] = useState('');

  // const [server_error, setServerError] = useState({});
  const { data,isSuccess, isLoading} = useGettagsQuery(props.data)
    // console.log(data)

    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (!isSuccess || !data) {
      return <div>No data found</div>;
    }
  
  return(
    <>
    <h1>Tags : {data[0].name}
    {data[1] ? <span className='pl-2'>, { data[1].name}</span> : ""}
    {data[2] ? <span className='pl-2'>, { data[2].name}</span> : ""}
    </h1>
    
    </>
  )

  
  
}

export default Tags;
