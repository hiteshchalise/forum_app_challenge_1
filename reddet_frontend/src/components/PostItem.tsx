import {
  Avatar, Container,
  Box, createStyles, Grid, Space, Badge,
} from '@mantine/core';
import moment from 'moment';
import IPost from '../types/postType';
import UpvoteLogo from '../assets/UpvoteLogo';
import DownvoteLogo from '../assets/DownvoteLogo';

interface PostItemProps {
  post: IPost
}

interface IPostHeaderProps {
  posted_at: string,
  postedBy: string,
}

const useStyle = createStyles((theme) => ({
  votesWrapper: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3],
    borderTopLeftRadius: theme.radius.md,
    borderBottomLeftRadius: theme.radius.md,
    textAlign: 'center',
  },
}));

function PostHeader({ posted_at, postedBy }: IPostHeaderProps) {
  const postedAt = Date.parse(posted_at);
  const postedTimeAgo = moment(postedAt).fromNow();
  return (
    <Container
      sx={() => ({
        display: 'flex',
        alignItems: 'center',
      })}
    >
      <Avatar
        radius="xl"
        sx={() => ({
          display: 'inline-block',
        })}
      >
        {postedBy.substring(2, 3).toUpperCase()}
      </Avatar>
      <Space w="sm" />
      <b>{postedBy}</b>
      <Space w="sm" />
      <Badge>{postedTimeAgo}</Badge>
    </Container>
  );
}

export default function PostItem({ post }: PostItemProps) {
  const { classes } = useStyle();

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
      >
        <Grid>
          <Grid.Col span={1}>
            <Grid p="sm" className={classes.votesWrapper}>
              <Grid.Col span={12}>
                <UpvoteLogo active />
              </Grid.Col>
              <Grid.Col span={12}>{post.upvotes}</Grid.Col>
              <Grid.Col span={12}>
                <DownvoteLogo active />
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={11}>
            <Grid>
              <Grid.Col span={12}>
                <PostHeader posted_at={post.posted_at} postedBy="u/hiteshchalise" />
              </Grid.Col>
            </Grid>
            {post.post_title}
          </Grid.Col>
        </Grid>
      </Box>
      <Space h="lg" />
    </>
  );
}
