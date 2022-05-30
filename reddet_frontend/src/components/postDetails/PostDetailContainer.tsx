import { Container, createStyles, Stack } from '@mantine/core';
import PostDetailsBody from './PostDetailBody';
import PostDetailsHeader from './PostDetailsHeader';

const contentPaddingHorizontal = '32';

export const useStyles = createStyles((theme) => ({
  header: {
    color: theme.colors.gray[0],
    backgroundColor: theme.colors.dark[9],
    margin: 0,
    maxWidth: '100%',
  },
  body: {
    paddingTop: '32',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0],
  },
  sidePane: {
    cursor: 'pointer',
  },
}));

export function PostDetailContainer() {
  const { classes } = useStyles();

  return (
    <Stack
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
        height: '100vh',
      })}
    >
      <Container className={classes.header}>
        <PostDetailsHeader />
      </Container>
      <Container className={classes.body}>
        <PostDetailsBody />
      </Container>
    </Stack>
  );
}
