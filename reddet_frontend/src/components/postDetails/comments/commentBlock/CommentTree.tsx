/* eslint-disable no-underscore-dangle */
import {
  Avatar, Badge, Box, Container, Space, Stack, Text,
} from '@mantine/core';
import moment from 'moment';
import { ICommentDetail } from 'types/commentType';
import { VoteActiveState } from 'components/posts/UpvoteSection';
import { IUserResponse } from 'services/user';
import CommentDisplay from './CommentDisplay';
import Footer from './Footer';

interface ICommentBlockProps {
  comment: ICommentDetail,
  activeState: VoteActiveState
}

function getActiveState(user: IUserResponse | undefined, comment: ICommentDetail) {
  let activeState: VoteActiveState;
  if (!user || (user && user.voted_comments.length === 0)) {
    activeState = VoteActiveState.Neutral;
  } else {
    const votedComment = user.voted_comments.find(
      ((voted_comment) => voted_comment._id === comment._id),
    );
    if (votedComment && votedComment.dir === 1) {
      activeState = VoteActiveState.Up;
    } else if (!votedComment || (votedComment && votedComment.dir === 0)) {
      activeState = VoteActiveState.Neutral;
    } else {
      activeState = VoteActiveState.Down;
    }
  }
  return activeState;
}

export function CommentBlock({ comment, activeState }: ICommentBlockProps) {
  const commentedAt = Date.parse(comment.commented_at);
  const commentedTimeAgo = moment(commentedAt).fromNow();

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        padding: theme.spacing.md,
      })}
    >
      <Avatar radius="xl" color="blue">
        {comment.commented_by.name.substring(0, 2)}
      </Avatar>
      <Space w="sm" />
      <Stack
        sx={(theme) => ({
          paddingTop: theme.spacing.xs,
          width: '100%',
        })}
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
        <CommentDisplay commentBody={comment.comment_body} />
        <Footer activeState={activeState} comment={comment} />
      </Stack>
    </Box>
  );
}

export default function CommentTree({
  comment, user,
}: { comment: ICommentDetail, user: IUserResponse | undefined }) {
  const activeState = getActiveState(user, comment);
  return (
    <>
      <CommentBlock comment={comment} activeState={activeState} />
      {
        comment.child_comments && comment.child_comments.length > 0
          ? comment.child_comments.map(
            (childComment) => (
              <Box
                key={childComment._id}
                sx={{ paddingLeft: '48px' }}
              >
                <CommentTree
                  comment={childComment}
                  user={user}
                />
              </Box>
            ),
          ) : null
      }
    </>
  );
}
