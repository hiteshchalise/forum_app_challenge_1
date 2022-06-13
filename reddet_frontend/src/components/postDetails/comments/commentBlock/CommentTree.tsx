/* eslint-disable no-underscore-dangle */
import {
  Avatar, Badge, Box, Button, Container, createStyles, Divider, Space, Stack, Text, useMantineTheme,
} from '@mantine/core';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import { ICommentDetail } from 'types/commentType';
import { VoteActiveState } from 'components/posts/UpvoteSection';
import { IUserResponse } from 'services/user';
import { useReplyOnCommentMutation } from 'services/comments';
import { showNotification } from '@mantine/notifications';
import CommentDisplay from './CommentDisplay';
import Footer from './Footer';

const useStyles = createStyles((theme) => ({
  commentContainer: {
    marginLeft: theme.spacing.md / 2 + theme.spacing.lg,
    marginTop: theme.spacing.lg,
    position: 'relative',
  },
}));

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
  const replyOnCommentMutation = useReplyOnCommentMutation(() => {
    showNotification({
      id: 'replyOnComment',
      autoClose: 4000,
      disallowClose: true,
      message: 'Comment replied successfully.',
      color: 'red',
    });
  });

  const hanldeReplySubmit = (replyValue: string) => {
    replyOnCommentMutation.mutate({
      postId: comment.commented_to,
      commentId: comment._id,
      value: replyValue,
    });
  };

  return (
    <Box
      sx={() => ({
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
      })}
    >
      <Stack sx={(theme) => ({
        gap: theme.spacing.xs,
      })}
      >
        <Avatar radius="xl" color="blue" sx={{ flex: '0 0 auto' }}>
          {comment.commented_by.name.substring(0, 2)}
        </Avatar>
      </Stack>
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
        <Footer activeState={activeState} comment={comment} onReplySubmit={hanldeReplySubmit} />
      </Stack>
    </Box>
  );
}

export default function CommentTree({
  comment, user,
}: { comment: ICommentDetail, user: IUserResponse | undefined }) {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const activeState = getActiveState(user, comment);
  const { postId } = useParams();
  return (

    <Box
      className={classes.commentContainer}
    >
      <Divider
        sx={{
          position: 'absolute',
          borderLeftColor: theme.colors.gray[2],
          margin: theme.spacing.sm + theme.spacing.xs / 3,
          padding: theme.spacing.xs,
          '&:hover': {
            borderLeftColor: theme.colors.blue[3],
            cursor: 'pointer',
          },
        }}
        orientation="vertical"
        size="lg"
        color={theme.fn.rgba('red', 0)}
      />
      <CommentBlock comment={comment} activeState={activeState} />
      {
        comment.child_comments
          && comment.child_comments[0]
          && !comment.child_comments[0].commented_by
          ? (
            <Button
              sx={{ marginLeft: '48px' }}
              variant="subtle"
              component={Link}
              to={`/posts/${postId as string}/comments/${comment._id}`}
              compact
            >
              See more..
            </Button>
          )
          : ''
      }
      {
        comment.child_comments && comment.child_comments.length > 0
          ? comment.child_comments.map(
            (childComment) => {
              if (childComment.commented_by) {
                return (
                  <Box
                    key={childComment._id}
                  >
                    <CommentTree
                      comment={childComment}
                      user={user}
                    />
                  </Box>
                );
              }
              return '';
            },
          ) : null
      }
    </Box>
  );
}
