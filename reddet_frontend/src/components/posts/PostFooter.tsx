import {
  Button, Container, Space, ThemeIcon,
} from '@mantine/core';
import CommentIcon from 'assets/CommentIcon';

interface IPostFooterProp {
  commentLength: number
}

export default function PostFooter({ commentLength }: IPostFooterProp) {
  return (
    <Container pt="sm" pl={0}>
      <Button variant="subtle">
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
