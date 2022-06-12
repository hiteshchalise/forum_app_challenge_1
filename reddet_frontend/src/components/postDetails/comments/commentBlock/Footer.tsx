/* eslint-disable no-underscore-dangle */
import {
  Button,
  Container, Space, Stack, Text,
} from '@mantine/core';
import { ICommentDetail } from 'types/commentType';
import { VoteActiveState } from 'components/posts/UpvoteSection';
import { showNotification } from '@mantine/notifications';
import DownvoteLogo from 'assets/DownvoteLogo';
import UpvoteLogo from 'assets/UpvoteLogo';
import { useAuth } from 'providers/authProvider';
import {
  ReactEventHandler, useRef, useState,
} from 'react';
import { useVoteComment } from 'services/comments';
import { Loader, Message } from 'tabler-icons-react';
import RichTextEditor, { Editor } from '@mantine/rte';

interface IFooterProps {
  comment: ICommentDetail,
  activeState: VoteActiveState,
  onReplySubmit: (string) => void,
}

export default function Footer({ comment, activeState, onReplySubmit }: IFooterProps) {
  const [showReply, setShowReply] = useState(false);
  const editorRef = useRef<Editor>() as React.RefObject<Editor>;
  const [replyValue, setReplyValue] = useState('');
  const voteCommentMutation = useVoteComment();
  const auth = useAuth();

  const handleUpvote: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    if (auth?.data?.user) { voteCommentMutation.mutate({ id: comment._id, dir: 1 }); } else {
      showNotification({
        id: 'postVote',
        autoClose: 4000,
        disallowClose: true,
        title: 'Unauthorized action',
        message: 'Please Login first.',
        color: 'red',
      });
    }
  };
  const handleDownvote: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    if (auth?.data?.user) { voteCommentMutation.mutate({ id: comment._id, dir: -1 }); } else {
      showNotification({
        id: 'postVote',
        autoClose: 4000,
        disallowClose: true,
        title: 'Unauthorized action',
        message: 'Please Login first.',
        color: 'red',
      });
    }
  };

  const handleSubmit: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    onReplySubmit(replyValue);
    setReplyValue('');
    if (editorRef.current) editorRef.current.editor?.setText('');
  };

  const hanldeReplyButton: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    setShowReply(!showReply);
  };

  return (
    <>
      <Container sx={{
        display: 'flex',
        padding: 0,
        margin: 0,
        alignItems: 'center',
      }}
      >
        <UpvoteLogo
          active={activeState === 1}
          onClickListener={handleUpvote}
        />
        {voteCommentMutation.isLoading ? <Loader color="gray" /> : <Text px="sm">{comment.upvotes}</Text>}
        <DownvoteLogo
          active={activeState === 3}
          onClickListener={handleDownvote}
        />
        <Space w="lg" />
        <Button
          variant="subtle"
          leftIcon={<Message color="gray" size={24} />}
          onClick={hanldeReplyButton}
        >
          <Text color="gray" size="xs">Reply</Text>
        </Button>

      </Container>
      <Stack sx={{ display: showReply ? 'flex' : 'none' }}>
        <RichTextEditor
          ref={editorRef}
          value={replyValue}
          onChange={setReplyValue}
          controls={[
            ['bold', 'italic', 'underline'],
            ['unorderedList', 'h1', 'h2', 'h3'],
            ['sup', 'sub'],
            ['alignLeft', 'alignCenter', 'alignRight'],
          ]}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </Stack>
    </>
  );
}
