import {
  Box, Grid, Space,
} from '@mantine/core';
import { ReactEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import IPost from '../../types/postType';
import PostHeader from './PostHeader';
import PostBody from './PostBody';
import UpvoteSection from './UpvoteSection';
import PostFooter from './PostFooter';

interface PostItemProps {
  post: IPost
}

export default function PostItem({ post }: PostItemProps) {
  const navigate = useNavigate();

  const handleClick: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    // eslint-disable-next-line no-underscore-dangle
    navigate(`/posts/${post._id}`);
  };

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
              activeState={3}
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
