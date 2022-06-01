/* eslint-disable no-underscore-dangle */
import {
  Grid,
} from '@mantine/core';
import PostFooter from 'components/posts/PostFooter';
import PostHeader from 'components/posts/PostHeader';
import UpvoteSection, { VoteActiveState } from 'components/posts/UpvoteSection';
import { ReactEventHandler } from 'react';
import { IPostDetail } from 'types/postType';
import CommentSection from './comments/CommentSection';
import CommentInputSection from './contents/CommentInputSection';
import PostContent from './contents/PostContent';

interface IPostDetailsBodyProps {
  postData: IPostDetail,
  activeState: VoteActiveState
}

export default function PostDetailsMain({ postData, activeState }: IPostDetailsBodyProps) {
  const handleUpvote: ReactEventHandler = (ev) => {
    ev.stopPropagation();
  };

  const handleDownvote: ReactEventHandler = (ev) => {
    ev.stopPropagation();
  };

  const handleCommentClicked: ReactEventHandler = (ev) => {
    ev.stopPropagation();
  };

  return (
    <>
      <Grid>
        <Grid.Col
          span={1}
        >
          <UpvoteSection
            upvotes={postData.upvotes}
            handleUpvote={handleUpvote}
            handleDownvote={handleDownvote}
            activeState={activeState}
          />
        </Grid.Col>
        <Grid.Col span={11} pr="lg">
          <PostHeader posted_at={postData.posted_at} postedBy={postData.posted_by.name} />
          <PostContent post_title={postData.post_title} post_body={postData.post_body} />
          <PostFooter
            commentLength={postData.comments.length}
            onCommentClicked={handleCommentClicked}
          />
          <CommentInputSection postId={postData._id} />
        </Grid.Col>
      </Grid>
      <CommentSection comments={postData.comments} />
    </>
  );
}
