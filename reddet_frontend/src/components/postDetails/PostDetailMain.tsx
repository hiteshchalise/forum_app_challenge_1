import {
  Grid, Paper, ScrollArea, Text,
} from '@mantine/core';
import PostBody from 'components/posts/PostBody';
import PostFooter from 'components/posts/PostFooter';
import PostHeader from 'components/posts/PostHeader';
import UpvoteSection from 'components/posts/UpvoteSection';
import { ReactEventHandler } from 'react';
import { IPostDetail } from 'types/postType';
import CommentSection from './comments/CommentSection';
import CommentInputSection from './contents/CommentInputSection';
import PostContent from './contents/PostContent';

interface IPostDetailsBodyProps {
  postData: IPostDetail
}

export default function PostDetailsMain({ postData }: IPostDetailsBodyProps) {
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
    <Grid>
      <Grid.Col
        span={1}
      >
        <UpvoteSection
          upvotes={postData.upvotes}
          handleUpvote={handleUpvote}
          handleDownvote={handleDownvote}
          activeState={2}
        />
      </Grid.Col>
      <Grid.Col span={11} pr="lg">
        <PostHeader posted_at={postData.posted_at} postedBy="u/hiteshchalise" />
        <PostContent post_title={postData.post_title} post_body={postData.post_body} />
        <PostFooter
          commentLength={postData.comments.length}
          onCommentClicked={handleCommentClicked}
        />
        <CommentInputSection />
        <CommentSection />
      </Grid.Col>
    </Grid>
  );
}
