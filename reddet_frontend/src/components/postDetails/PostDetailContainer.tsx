import {
  Box,
  Container, createStyles, Stack,
} from '@mantine/core';
import Loading from 'components/Loading';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getPostDetails } from 'services/posts';
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
  const query = useQuery(['posts', postId], () => getPostDetails(postId as string));

  if (query.isLoading) {
    return (
      <Box className={classes.container} sx={{ height: '100vh' }}>
        <Loading />
      </Box>
    );
  }

  if (!query.data) return null;

  return (
    <Stack
      className={classes.container}
    >
      <Container className={classes.header}>
        <PostDetailsHeader postData={query.data} />
      </Container>
      <Container className={classes.body}>
        <PostDetailsMain postData={query.data} />
      </Container>
    </Stack>
  );
}

export default PostDetailContainer;
