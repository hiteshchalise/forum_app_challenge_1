import {
  Box, Button, Container, Space,
} from '@mantine/core';

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
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
      }}
      >
        <Button radius="xl" variant="outline">Log In</Button>
        <Space w="sm" />
        <Button radius="xl" variant="filled">Sign Up</Button>
      </Box>
    </Container>
  );
}
