import { useParams } from 'react-router-dom';

export default function CommentDetailed() {
  const { postId, commentId } = useParams();
  return (
    <p>
      hehehehe
      {' '}
      {postId}
      {' '}
      {commentId}
    </p>
  );
}
