import {
  Button,
  Container, Space, Stack,
} from '@mantine/core';
import RichTextEditor from '@mantine/rte';
import AuthButtons from 'components/AuthButtons';
import { ReactEventHandler, useState } from 'react';
import useCommentMutation from 'services/comments';
import storage, { IAuth } from 'utils/storage';

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
  const mutation = useCommentMutation();

  const auth: IAuth | null = storage.getAuth();

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
      {auth?.user && <CommentInput name={auth.user.name} onSubmit={handleSubmit} />}
      {!auth?.user
        && (
          <>
            Log in or Sign up to leave a comment.
            <Space h="sm" />
            <AuthButtons />
          </>
        )}
    </Container>
  );
}
