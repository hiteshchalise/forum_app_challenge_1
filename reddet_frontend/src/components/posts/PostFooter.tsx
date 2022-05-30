import {
  Button, Container, Space, ThemeIcon,
} from '@mantine/core';
import CommentIcon from 'assets/CommentIcon';
import { ReactEventHandler } from 'react';

interface IPostFooterProp {
  commentLength: number,
  onCommentClicked: ReactEventHandler
}

export default function PostFooter({ commentLength, onCommentClicked }: IPostFooterProp) {
  return (
    <Container pt="sm" pl={0}>
      <Button variant="subtle" onClick={onCommentClicked}>
        <ThemeIcon size={24} variant="light">
          <CommentIcon />
        </ThemeIcon>
        <Space w="xs" />
        {commentLength}
        {' '}
        Comments
      </Button>
    </Container>
  );
}
