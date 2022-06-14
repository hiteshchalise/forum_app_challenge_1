import {
  Box, Button, createStyles, Space, Stack,
} from '@mantine/core';
import Loading from 'components/Loading';
import { useAuth } from 'providers/authProvider';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import useUserQuery from 'services/user';
import { ArrowLeft } from 'tabler-icons-react';
import { getCommentDetail } from '../../../services/comments';
import CommentTree from './commentBlock/CommentTree';

const useStyles = createStyles((theme) => ({
  container: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
    minHeight: '100vh',
  },
}));

export default function CommentDetailed() {
  const { postId, commentId } = useParams();
  const { classes } = useStyles();
  const auth = useAuth();
  const userQuery = useUserQuery(auth?.data?.user.id);
  const commentQuery = useQuery(
    ['comment', postId, commentId],
    () => getCommentDetail(postId as string, commentId as string),
  );

  if (commentQuery.isLoading) {
    return (
      <Box className={classes.container} sx={{ height: '100vh' }}>
        <Loading />
      </Box>
    );
  }

  if (!commentQuery.data) return null;

  return (
    <Stack sx={{ alignItems: 'flex-start' }}>
      <Space h="lg" />
      <Button
        sx={{ marginLeft: '48px' }}
        variant="subtle"
        component={Link}
        to={`/posts/${postId as string}/`}
        leftIcon={<ArrowLeft />}
        compact
      >
        Back to parent thread
      </Button>
      <CommentTree comment={commentQuery.data} user={userQuery.data} />
    </Stack>
  );
}
