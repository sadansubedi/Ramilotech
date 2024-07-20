
import React, { useState, useEffect } from 'react';
import { useGetCommentsQuery, useAddCommentMutation, useGetLoggedUserQuery,useGetRegisterUserQuery } from '../services/userAuthApi';
import { getToken } from '../services/LocalStorageService';
import { useNavigate } from 'react-router-dom';

const CommentSection = ({ post }) => {
  const { access_token } = getToken();
  const postId = post?.id;
  const navigate = useNavigate();

  const { data: loggedInUser, isSuccess: isUserLoaded } = useGetLoggedUserQuery(access_token);

  // useEffect(() => {
  //   // console.log('Post ID:', postId);
  // }, [postId]);

  const { data: fetchedComments, error, isLoading, refetch } = useGetCommentsQuery(postId, {
    skip: !postId || !access_token, // Skip query if postId is undefined or user is not authenticated
  });

  // useEffect(() => {
  //   console.log('Fetched Comments:', fetchedComments);
  // }, [fetchedComments]);

  const [content, setContent] = useState('');
  const [addComment, { isLoading: isAdding }] = useAddCommentMutation();

  const handleAddComment = async (e, parentId = null, replyContent = '', setReplyContent = null) => {
    e.preventDefault();
    if (!access_token) {
      navigate('/login');
      return;
    }

    const commentContent = parentId ? replyContent : content;

    try {
      await addComment({ post: postId, content: commentContent, parent: parentId, author: loggedInUser.id }).unwrap();
      if (!parentId) {
        setContent('');
      } else if (setReplyContent) {
        setReplyContent('');
      }
      refetch(); // Refetch comments to update the list
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const structuredComments = structureComments(fetchedComments || []);

  return (
    <div className="mt-4">
      <h2 className="font-bold text-lg mb-2">Comments</h2>
      <form onSubmit={(e) => handleAddComment(e)} className="flex items-center space-x-2 mb-4">
        <div className="flex-grow">
          <label htmlFor="content" className="sr-only">Comment</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={1}
            className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
            placeholder="Add a comment..."
          />
        </div>
        <button
          type="submit"
          disabled={isAdding}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-1 rounded-xl focus:outline-none focus:shadow-outline"
        >
          {isAdding ? 'Posting...' : 'Comment'}
        </button>
      </form>
      {access_token ? (
        isLoading ? (
          <div>Loading comments...</div>
        ) : error ? (
          <div>Error loading comments {console.log(error)}</div>
        ) : structuredComments.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          structuredComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              handleAddComment={handleAddComment}
              access_token={access_token}
            />
          ))
        )
      ) : (
        <p>Please  to view and post comments.</p>
      )}
    </div>
  );
};

const CommentItem = ({ comment, postId, handleAddComment, access_token }) => {
  const [replyContent, setReplyContent] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const navigate = useNavigate();
  console.log("cooment author ",comment.author)
  const { data: authorData, isLoading: isAuthorLoading, isSuccess: isAuthorSuccess } = useGetRegisterUserQuery(comment.author);
  console.log(authorData)
  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (!access_token) {
      navigate('/login'); // Redirect to login page if not authenticated
      return;
    }
    handleAddComment(e, comment.id, replyContent, setReplyContent);
  };

  return (
    <div className="mb-2">
      <p className="text-gray-700">
        <strong>{isAuthorLoading ? 'Loading...' : (isAuthorSuccess && authorData ? authorData.name : 'Unknown')}:</strong> {comment.content}
      </p>
      {access_token && (
        <>
          <button onClick={toggleReplyForm} className="text-blue-500 text-sm mb-2">
            Reply
          </button>
          {showReplyForm && (
            <form onSubmit={handleSubmitReply} className="ml-4 flex items-center space-x-2 mt-2">
              <div className="flex-grow">
                <label htmlFor={`reply-content-${comment.id}`} className="sr-only">Reply</label>
                <textarea
                  id={`reply-content-${comment.id}`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  required
                  rows={1}
                  className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
                  placeholder="Add a reply..."
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-1 rounded-xl focus:outline-none focus:shadow-outline"
              >
                Reply
              </button>
            </form>
          )}
        </>
      )}
      {comment.replies && comment.replies.map((reply) => (
        <div key={reply.id} className="ml-4 text-gray-600">
          <CommentItem comment={reply} postId={postId} handleAddComment={handleAddComment} access_token={access_token} />
        </div>
      ))}
    </div>
  );
};

const structureComments = (comments) => {
  const commentMap = {};

  // Create a deep copy of comments to avoid mutation issues
  const commentsCopy = comments.map(comment => ({
    ...comment,
    replies: [...(comment.replies || [])]
  }));

  // Create a map of comments
  commentsCopy.forEach((comment) => {
    commentMap[comment.id] = comment;
  });

  // Structure comments with replies nested
  const structuredComments = [];
  commentsCopy.forEach((comment) => {
    if (comment.parent) {
      if (commentMap[comment.parent]) {
        commentMap[comment.parent].replies.push(comment);
      }
    } else {
      structuredComments.push(comment);
    }
  });

  return structuredComments;
};

export default CommentSection;


//the below code also work here comments and reply are seen by everyone but can't reply or comment on post
// import React, { useState } from 'react';
// import { useGetCommentsQuery, useAddCommentMutation, useGetLoggedUserQuery, useGetRegisterUserQuery } from '../services/userAuthApi';
// import { getToken } from '../services/LocalStorageService';
// import { useNavigate } from 'react-router-dom';

// const CommentSection = ({ post }) => {
//   const { access_token } = getToken();
//   const postId = post?.id;
//   const navigate = useNavigate();

//   const { data: loggedInUser, isSuccess: isUserLoaded } = useGetLoggedUserQuery(access_token);

//   const { data: fetchedComments, error, isLoading, refetch } = useGetCommentsQuery(postId, {
//     skip: !postId // Skip query if postId is undefined
//   });

//   const [content, setContent] = useState('');
//   const [addComment, { isLoading: isAdding }] = useAddCommentMutation();

//   const handleAddComment = async (e, parentId = null, replyContent = '', setReplyContent = null) => {
//     e.preventDefault();
//     if (!access_token) {
//       navigate('/login');
//       return;
//     }

//     const commentContent = parentId ? replyContent : content;

//     try {
//       await addComment({ post: postId, content: commentContent, parent: parentId, author: loggedInUser.id }).unwrap();
//       if (!parentId) {
//         setContent('');
//       } else if (setReplyContent) {
//         setReplyContent('');
//       }
//       refetch(); // Refetch comments to update the list
//     } catch (error) {
//       console.error('Failed to add comment:', error);
//     }
//   };

//   const structuredComments = structureComments(fetchedComments || []);

//   return (
//     <div className="mt-4">
//       <h2 className="font-bold text-lg mb-2">Comments</h2>
//       <form onSubmit={(e) => handleAddComment(e)} className="flex items-center space-x-2 mb-4">
//         <div className="flex-grow">
//           <label htmlFor="content" className="sr-only">Comment</label>
//           <textarea
//             id="content"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             required
//             rows={1}
//             className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
//             placeholder="Add a comment..."
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={isAdding}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-1 rounded-xl focus:outline-none focus:shadow-outline"
//         >
//           {isAdding ? 'Posting...' : 'Comment'}
//         </button>
//       </form>
//       {isLoading ? (
//         <div>Loading comments...</div>
//       ) : error ? (
//         <div>Error loading comments {console.log(error)}</div>
//       ) : structuredComments.length === 0 ? (
//         <p>No comments yet</p>
//       ) : (
//         structuredComments.map((comment) => (
//           <CommentItem
//             key={comment.id}
//             comment={comment}
//             postId={postId}
//             handleAddComment={handleAddComment}
//             access_token={access_token}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// const CommentItem = ({ comment, postId, handleAddComment, access_token }) => {
//   const [replyContent, setReplyContent] = useState('');
//   const [showReplyForm, setShowReplyForm] = useState(false);
//   const navigate = useNavigate();

//   const { data: authorData, isLoading: isAuthorLoading, isSuccess: isAuthorSuccess } = useGetRegisterUserQuery(comment.author);

//   const toggleReplyForm = () => {
//     setShowReplyForm(!showReplyForm);
//   };

//   const handleSubmitReply = (e) => {
//     e.preventDefault();
//     if (!access_token) {
//       navigate('/login'); // Redirect to login page if not authenticated
//       return;
//     }
//     handleAddComment(e, comment.id, replyContent, setReplyContent);
//   };

//   return (
//     <div className="mb-2">
//       <p className="text-gray-700">
//         <strong>{isAuthorLoading ? 'Loading...' : (isAuthorSuccess && authorData ? authorData.name : 'Unknown')}:</strong> {comment.content}
//       </p>
//       {access_token && (
//         <>
//           <button onClick={toggleReplyForm} className="text-blue-500 text-sm mb-2">
//             Reply
//           </button>
//           {showReplyForm && (
//             <form onSubmit={handleSubmitReply} className="ml-4 flex items-center space-x-2 mt-2">
//               <div className="flex-grow">
//                 <label htmlFor={`reply-content-${comment.id}`} className="sr-only">Reply</label>
//                 <textarea
//                   id={`reply-content-${comment.id}`}
//                   value={replyContent}
//                   onChange={(e) => setReplyContent(e.target.value)}
//                   required
//                   rows={1}
//                   className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
//                   placeholder="Add a reply..."
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-1 rounded-xl focus:outline-none focus:shadow-outline"
//               >
//                 Reply
//               </button>
//             </form>
//           )}
//         </>
//       )}
//       {comment.replies && comment.replies.map((reply) => (
//         <div key={reply.id} className="ml-4 text-gray-600">
//           <CommentItem comment={reply} postId={postId} handleAddComment={handleAddComment} access_token={access_token} />
//         </div>
//       ))}
//     </div>
//   );
// };

// const structureComments = (comments) => {
//   const commentMap = {};

//   // Create a deep copy of comments to avoid mutation issues
//   const commentsCopy = comments.map(comment => ({
//     ...comment,
//     replies: [...(comment.replies || [])]
//   }));

//   // Create a map of comments
//   commentsCopy.forEach((comment) => {
//     commentMap[comment.id] = comment;
//   });

//   // Structure comments with replies nested
//   const structuredComments = [];
//   commentsCopy.forEach((comment) => {
//     if (comment.parent) {
//       if (commentMap[comment.parent]) {
//         commentMap[comment.parent].replies.push(comment);
//       }
//     } else {
//       structuredComments.push(comment);
//     }
//   });

//   return structuredComments;
// };

// export default CommentSection;
