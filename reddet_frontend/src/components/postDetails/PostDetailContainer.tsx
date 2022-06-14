/* eslint-disable no-underscore-dangle */
import {
  Box,
  Container, createStyles, Stack,
} from '@mantine/core';
import Loading from 'components/Loading';
import { VoteActiveState } from 'components/posts/UpvoteSection';
import { useAuth } from 'providers/authProvider';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getPostDetails } from 'services/posts';
import useUserQuery from 'services/user';
import PostDetailsMain from './PostDetailMain';
import PostDetailsHeader from './PostDetailsHeader';

const useStyles = createStyles((theme) => ({
  header: {
    color: theme.colors.gray[0],
    backgroundColor: theme.colors.dark[9],
    margin: 0,
    maxWidth: '100%',
  },
  body: {
    paddingTop: '32',
    paddingLeft: '0',
    paddingRight: '0',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0],
    margin: theme.spacing.lg,
    maxWidth: '100%',
  },
  sidePane: {
    cursor: 'pointer',
  },
  container: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
    minHeight: '100vh',
  },
}));

function PostDetailContainer() {
  const { classes } = useStyles();
  const { postId } = useParams();
  const auth = useAuth();
  const userQuery = useUserQuery(auth?.data?.user.id);
  const query = useQuery(['posts', postId], () => getPostDetails(postId as string));

  if (query.isLoading) {
    return (
      <Box className={classes.container} sx={{ height: '100vh' }}>
        <Loading />
      </Box>
    );
  }

  if (!query.data) return null;

  let activeState: VoteActiveState;
  if (!userQuery.data || (userQuery.data && userQuery.data.voted_posts.length === 0)) {
    activeState = VoteActiveState.Neutral;
  } else {
    const votedPost = userQuery.data.voted_posts.find(((post) => post._id === postId));
    if (!votedPost) {
      activeState = VoteActiveState.Neutral;
    } else if (votedPost.dir === 1) {
      activeState = VoteActiveState.Up;
    } else if (votedPost.dir === 0) {
      activeState = VoteActiveState.Neutral;
    } else {
      activeState = VoteActiveState.Down;
    }
  }

  return (
    <Stack
      className={classes.container}
    >
      <Container className={classes.header}>
        <PostDetailsHeader
          postData={query.data}
          activeState={activeState}
        />
      </Container>
      <Container className={classes.body}>
        <PostDetailsMain
          postData={query.data}
          activeState={activeState}
        />
      </Container>
    </Stack>
  );
}

export default PostDetailContainer;
