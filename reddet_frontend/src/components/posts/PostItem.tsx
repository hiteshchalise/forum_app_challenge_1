import {
  Box, Grid, Space,
} from '@mantine/core';
import { ReactEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVotePost } from 'services/posts';
import { useAuth } from 'providers/authProvider';
import IPost from '../../types/postType';
import PostHeader from './PostHeader';
import PostBody from './PostBody';
import UpvoteSection, { VoteActiveState } from './UpvoteSection';
import PostFooter from './PostFooter';

interface PostItemProps {
  post: IPost,
  activeState: VoteActiveState
}

export default function PostItem({ post, activeState }: PostItemProps) {
  const navigate = useNavigate();
  const auth = useAuth();
  const votePostMutation = useVotePost();

  const handleClick: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    navigate(`/posts/${post.id}`);
  };

  const handleUpvote: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    if (auth?.data?.token) votePostMutation.mutate({ id: post.id, dir: 1 });
    else console.log('cannot perform that operation, notification system implementation');
  };

  const handleDownvote: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    if (auth?.data?.token) votePostMutation.mutate({ id: post.id, dir: -1 });
    else console.log('cannot perform that operation, notification system implementation');
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
              commentLength={post.comments.length}
              onCommentClicked={handleCommentClicked}
            />
          </Grid.Col>
        </Grid>
      </Box>
      <Space h={48} />
    </>
  );
}
