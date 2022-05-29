import {
  Box, Grid, Space,
} from '@mantine/core';
import { ReactEventHandler } from 'react';
import IPost from '../../types/postType';
import PostHeader from './PostHeader';
import PostBody from './PostBody';
import UpvoteSection from './UpvoteSection';
import PostFooter from './PostFooter';

interface PostItemProps {
  post: IPost
}

export default function PostItem({ post }: PostItemProps) {
  const handleClick: ReactEventHandler = (ev) => {
    console.log('clicked');
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
            <UpvoteSection upvotes={post.upvotes} />
          </Grid.Col>
          <Grid.Col span={11}>
            <Grid>
              <Grid.Col span={12}>
                <PostHeader posted_at={post.posted_at} postedBy="u/hiteshchalise" />
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={12} p={0} pr="xs">
                <PostBody post_title={post.post_title} post_body={post.post_body} />
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={12}>
                <PostFooter commentLength={post.comments.length} />
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </Box>
      <Space h={48} />
    </>
  );
}
