import {
  Button,
  Container, Space, Stack,
} from '@mantine/core';
import RichTextEditor from '@mantine/rte';
import AuthButtons from 'components/AuthButtons';
import { useAuth } from 'providers/authProvider';
import { ReactEventHandler, useState } from 'react';
import useCommentMutation from 'services/comments';

function CommentInput({ name, onSubmit }: { name: string, onSubmit: (value: string) => void }) {
  const [value, setValue] = useState('');

  const handleSubmit: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    onSubmit(value);
    setValue('');
  };

  return (
    <Stack sx={{ minWidth: '100%' }}>
      <RichTextEditor
        value={value}
        onChange={setValue}
        placeholder={`comment as ${name}`}
        controls={[
          ['bold', 'italic', 'underline'],
          ['unorderedList', 'h1', 'h2', 'h3'],
          ['sup', 'sub'],
          ['alignLeft', 'alignCenter', 'alignRight'],
        ]}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </Stack>
  );
}

export default function CommentInputSection({ postId }: { postId: string }) {
  const auth = useAuth();
  const mutation = useCommentMutation();

  const displayLoggedInUser = auth?.data && auth.data.user;
  const displayAuthButtons = !auth?.isLoading && !displayLoggedInUser;

  const handleSubmit = (text: string) => {
    mutation.mutate({ postId, value: text });
  };

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
      {
        auth?.data
        && auth.data.user
        && <CommentInput name={auth.data.user.name} onSubmit={handleSubmit} />
      }
      {
        displayAuthButtons ? (
          <>
            Log in or Sign up to leave a comment.
            <Space h="sm" />
            <AuthButtons />
          </>
        ) : null
      }
    </Container>
  );
}
