import { ICommentDetail } from 'types/commentType';

interface ICommentSectionProps {
  comments: ICommentDetail[]
}

export default function CommentSection({ comments }: ICommentSectionProps) {
  return (
    <div>
      {
        comments.map(
          // eslint-disable-next-line no-underscore-dangle
          (comment) => <div key={comment._id}>{comment.comment_body}</div>,
        )
      }
    </div>
  );
}
