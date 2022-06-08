/* eslint-disable no-underscore-dangle */
import {
  Space,
} from '@mantine/core';
import { IUserResponse } from 'services/user';
import { ICommentDetail } from 'types/commentType';
import CommentTree from './commentBlock/CommentTree';

export interface ICommentSectionProps {
  comments: ICommentDetail[],
  user: IUserResponse | undefined,
}

export default function CommentSection({ comments, user }: ICommentSectionProps) {
  return (
    <>
      <Space h="lg" />
      {
        comments.map(
          // eslint-disable-next-line no-underscore-dangle
          (comment: ICommentDetail) => (
            <CommentTree
              key={comment._id}
              comment={comment}
              user={user}
            />
          ),
        )
      }
    </>
  );
}
