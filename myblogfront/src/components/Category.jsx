import React, { useState } from 'react';
import { useCreatecategoryMutation,useGetcategoryQuery } from '../services/userAuthApi';


function CategoryInput(props) {
  // console.log(props.data)
  const [selectedCategory, setSelectedCategory] = useState('');

  const [server_error, setServerError] = useState({});
  // const [createcategory,{ isLoading }] = useCreatecategoryMutation();
//   console.log(useCreatecategoryMutation())
  const { data,isSuccess, isLoading} = useGetcategoryQuery(props.data)
    // console.log(data)

    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (!isSuccess || !data) {
      return <div>No data found</div>;
    }
  
  return(
    <>
    <h1>Category:{data.name}</h1>
    </>
  )

  
  
}

export default CategoryInput;

{/*
 <div className="mb-4">
      <label htmlFor="category" className="block text-gray-700">Select a Category:</label>
      <select 
        id="category" 
        name="category" 
        value={selectedCategory} 
        onChange={handleCategoryChange} 
        className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
      >
        <option value="">Select...</option>
        <option value="Artifical Intelligence"> AL/ML</option>
        <option value="Web dev">Web development</option>
        <option value="Mobile dev">Mobile development</option>
        //  Add more options as needed 
        </select>
        </div>


*/}

//   const handleSubmit = async(e) => {
  //     e.preventDefault();
  //     const datas = new FormData(e.currentTarget);
  
  //     const actualData = {
  //       title: datas.get('title'),
  //       content: datas.get('content'),
  //       creation_date: datas.get('creation_date'),
  //       // category: datas.get('category'),
  //       // tags : tagsArray,
  //       // tags:datas.get('tags'),
  //       author: data.id
  //     }
  //     const res = await createblogpost(actualData);
  //     console.log(res);
  //   if(res.error){
  //     setServerError(res.error.datas.errors);
  //   }
  //   if(res.datas){
  //     navigate('/');
  //   }
  //   };
  
  
    // const handleCategoryChange = async(e) => {
    //   e.preventDefault();
    //   // setSelectedCategory(e.target.value);
    //   console.log(e.target.value);
    //   const res = await createcategory(e.target.value);
    //   console.log(res)
    //   if(res.error){
    //       setServerError(res.error.datas.errors);
    //     }
    //     if(res){
    //       navigate('/');
    //     }
    // };
  
  