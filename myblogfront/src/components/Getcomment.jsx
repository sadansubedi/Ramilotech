import { useGetCommentsQuery } from "../services/userAuthApi";
const GetComments = ({ postId }) => {
    console.log(postId)
    const { data: comments, error, isLoading } = useGetCommentsQuery(postId);
    console.log(useGetCommentsQuery(postId))
    if (isLoading) return <div>Loading comments...</div>;
    if (error) return <div>Error loading comments {console.log(error)}</div>;
   
    return (
      <div>
        {comments.length === 0 ? (
          <p>No comments yet</p>
        ) :""
        //  (
        //   comments.map((comment) => (
        //     <CommentItem key={comment.id} comment={comment} />
        //   ))
        // )
        }
      </div>
    );
  };

  export default GetComments