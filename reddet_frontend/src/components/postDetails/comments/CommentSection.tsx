import {
  Avatar, Badge, Box, Container, Space, Stack, Text,
} from '@mantine/core';
import DownvoteLogo from 'assets/DownvoteLogo';
import UpvoteLogo from 'assets/UpvoteLogo';
import moment from 'moment';
import { ReactEventHandler } from 'react';
import { ICommentDetail } from 'types/commentType';

interface ICommentSectionProps {
  comments: ICommentDetail[]
}

interface ICommentContainerProps {
  comment: ICommentDetail
}

function CommentContainer({ comment }: ICommentContainerProps) {
  const commentedAt = Date.parse(comment.commented_at);
  const commentedTimeAgo = moment(commentedAt).fromNow();
  const handleUpvote: ReactEventHandler = (ev) => {
    ev.stopPropagation();
  };
  const handleDownvote: ReactEventHandler = (ev) => {
    ev.stopPropagation();
  };

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        paddingBottom: theme.spacing.md,
      })}
    >
      <Avatar
        radius="xl"
        color="blue"
      >
        {comment.commented_by.name.substring(0, 2)}
      </Avatar>
      <Space w="md" />
      <Stack
        sx={(theme) => ({ paddingTop: theme.spacing.xs })}
      >
        <Container sx={{
          display: 'flex',
          padding: 0,
          margin: 0,
          alignItems: 'center',
        }}
        >
          <Text size="sm" weight={500}>
            {comment.commented_by.name}
          </Text>
          <Space w="sm" />
          <Badge>
            {commentedTimeAgo}
          </Badge>
        </Container>
        <Text sx={{ display: 'block' }}>
          {comment.comment_body}
        </Text>
        <Container sx={{
          display: 'flex',
          padding: 0,
          margin: 0,
          alignItems: 'center',
        }}
        >
          <UpvoteLogo
            active={false}
            onClickListener={handleUpvote}
          />
          <Text px="sm">{comment.upvotes}</Text>
          <DownvoteLogo
            active={false}
            onClickListener={handleDownvote}
          />
          <Space w="lg" />
        </Container>
      </Stack>
    </Box>
  );
}

export default function CommentSection({ comments }: ICommentSectionProps) {
  return (
    <>
      <Space h="md" />
      {
        comments.map(
          // eslint-disable-next-line no-underscore-dangle
          (comment: ICommentDetail) => <CommentContainer key={comment._id} comment={comment} />,
        )
      }
    </>
  );
}
