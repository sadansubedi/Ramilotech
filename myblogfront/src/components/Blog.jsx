
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCreateblogpostMutation, useUpdateBlogPostMutation, useGetLoggedUserQuery } from '../services/userAuthApi';
import { getToken } from "../services/LocalStorageService";
import Alldata from './Alldata';

const Blog = () => {
  const { access_token } = getToken();
  const { data, isSuccess } = useGetLoggedUserQuery(access_token);
  // console.log(data)

  const navigate = useNavigate();
  const location = useLocation();
  const post = location.state ? location.state.post : null;
// console.log("post in blog.jsx =>",post)
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  const [createBlogPost] = useCreateblogpostMutation();
  const [updateBlogPost] = useUpdateBlogPostMutation();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setSelectedCategory(post.category);
      setSelectedTags(post.tags);
    }
  }, [post]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleTagChange = (event) => {
    const tagId = parseInt(event.target.value);
    if (event.target.checked) {
      setSelectedTags([...selectedTags, tagId]);
    } else {
      setSelectedTags(selectedTags.filter(tag => tag !== tagId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const actualData = {
      title,
      content,
      category: selectedCategory,
      tags: selectedTags,
      author: data.id
    };
    let res;
    if (post) {
      res = await updateBlogPost({ id: post.id, ...actualData });
    } else {
      res = await createBlogPost(actualData);
    }

    if (res.error) {
      // setServerError(res.error.data.errors);
      console.log("Error",res.error.data.errors);
    }
    if (res.data) {
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-lg">
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-4">{post ? 'Edit Post' : 'Create New Post'}</h2>
        <h2 className="text-lg font-bold mb-4">Select a Category:</h2>
        <div className="flex flex-wrap -mx-2 mb-4">
          {Alldata.categories.map(category => (
            <div key={category.id} className="px-2 mb-2">
              <input 
                type="checkbox" 
                id={`category-${category.id}`} 
                value={category.id} 
                checked={selectedCategory === category.id}
                onChange={() => handleCategoryChange(category.id)}
                className="hidden"
              />
              <label 
                htmlFor={`category-${category.id}`} 
                className={`block cursor-pointer rounded-lg p-2 border border-gray-300 ${selectedCategory === category.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700 font-bold mb-2">Content</label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        ></textarea>
      </div>
      <h2 className="text-lg font-bold mb-4">Select Tags:</h2>
      <div className="flex flex-wrap -mx-2">
        {Alldata.tags.map(tag => (
          <div key={tag.id} className="px-2 mb-2">
            <input 
              type="checkbox" 
              id={`tag-${tag.id}`} 
              value={tag.id} 
              checked={selectedTags.includes(tag.id)}
              onChange={handleTagChange}
              className="hidden"
            />
            <label 
              htmlFor={`tag-${tag.id}`} 
              className={`block cursor-pointer rounded-lg p-2 border border-gray-300 ${selectedTags.includes(tag.id) ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
            >
              {tag.name}
            </label>
          </div>
        ))}
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        {post ? 'Update Post' : 'Create Post'}
      </button>
    </form>
  );
};

export default Blog;
