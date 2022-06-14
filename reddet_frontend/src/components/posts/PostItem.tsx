import {
  Box, Grid, Space,
} from '@mantine/core';
import { ReactEventHandler, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVotePost } from 'services/posts';
import { useAuth } from 'providers/authProvider';
import { showNotification } from '@mantine/notifications';
import IComment, { ICommentDetail } from 'types/commentType';
import IPost, { IPostDetail } from '../../types/postType';
import PostHeader from './PostHeader';
import PostBody from './PostBody';
import UpvoteSection, { VoteActiveState } from './UpvoteSection';
import PostFooter from './PostFooter';

interface PostItemProps {
  post: IPostDetail,
  activeState: VoteActiveState
}

interface IGetCommentLengthType {
  (comments: ICommentDetail[]): number
}

export default function PostItem({ post, activeState }: PostItemProps) {
  const navigate = useNavigate();
  const auth = useAuth();
  const votePostMutation = useVotePost();

  const getCommentLength: IGetCommentLengthType = (
    comments: ICommentDetail[],
  ): number => (comments ? comments.reduce(
    (acc, comment) => acc + getCommentLength(comment.child_comments),
    comments.length,
  ) : 0);
  const handleClick: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    navigate(`/posts/${post.id}`);
  };

  const handleUpvote: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    if (auth?.data?.token) votePostMutation.mutate({ id: post.id, dir: 1 });
    else {
      showNotification({
        id: 'postVote',
        autoClose: 4000,
        disallowClose: true,
        title: 'Unauthorized action',
        message: 'Please Login first.',
        color: 'red',
      });
    }
  };

  const handleDownvote: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    if (auth?.data?.token) votePostMutation.mutate({ id: post.id, dir: -1 });
    else {
      showNotification({
        id: 'postVote',
        autoClose: 4000,
        disallowClose: true,
        title: 'Unauthorized action',
        message: 'Please Login first.',
        color: 'red',
      });
    }
  };

  const handleCommentClicked: ReactEventHandler = () => {
    // no-op parent will handle this event.
  };

  return (
    <>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
          borderRadius: theme.radius.md,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
          },
        })}
        onClick={handleClick}
      >
        <Grid>
          <Grid.Col
            span={1}
            sx={(theme) => ({
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3],
              borderTopLeftRadius: theme.radius.md,
              borderBottomLeftRadius: theme.radius.md,
            })}
          >
            <UpvoteSection
              upvotes={post.upvotes}
              handleDownvote={handleDownvote}
              handleUpvote={handleUpvote}
              activeState={activeState}
              isLoading={votePostMutation.isLoading}
            />
          </Grid.Col>
          <Grid.Col span={11}>
            <PostHeader posted_at={post.posted_at} postedBy={post.posted_by.name} />
            <PostBody post_title={post.post_title} post_body={post.post_body} />
            <PostFooter
              commentLength={getCommentLength(post.comments)}
              onCommentClicked={handleCommentClicked}
            />
          </Grid.Col>
        </Grid>
      </Box>
      <Space h={48} />
    </>
  );
}
