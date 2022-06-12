import {
  Button,
  Container, Space, Stack,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import RichTextEditor, { Editor } from '@mantine/rte';
import AuthButtons from 'components/AuthButtons';
import { ReactEventHandler, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useCommentMutation from 'services/comments';
import storage, { IAuth } from 'utils/storage';

function CommentInput({ name, onSubmit }: { name: string, onSubmit: (value: string) => void }) {
  const [value, setValue] = useState('');
  const editorRef = useRef<Editor>() as React.RefObject<Editor>;

  const handleSubmit: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    onSubmit(value);
    setValue('');
    if (editorRef.current) editorRef.current.editor?.setText('');
  };

  return (
    <Stack sx={{ minWidth: '100%' }}>
      <RichTextEditor
        ref={editorRef}
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

export default function CommentInputSection() {
  const mutation = useCommentMutation(() => {
    showNotification({
      id: 'submitComment',
      autoClose: 4000,
      disallowClose: true,
      message: 'Comment added successfully.',
      color: 'blue',
    });
  });
  const { postId } = useParams();

  const auth: IAuth | null = storage.getAuth();

  const handleSubmit = (text: string) => {
    if (!postId) return;
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
