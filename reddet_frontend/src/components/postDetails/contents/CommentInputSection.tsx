import {
  Container, Space,
} from '@mantine/core';
import AuthButtons from 'components/AuthButtons';

export default function CommentInputSection() {
  return (
    <Container
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[3],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      })}
    >
      Log in or Sign up to leave a comment.
      <Space h="sm" />
      <AuthButtons />
    </Container>
  );
}
