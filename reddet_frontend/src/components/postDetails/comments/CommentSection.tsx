/* eslint-disable no-underscore-dangle */
import {
  Avatar, Badge, Box, Container, Space, Stack, Text,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import RichTextEditor from '@mantine/rte';
import DownvoteLogo from 'assets/DownvoteLogo';
import UpvoteLogo from 'assets/UpvoteLogo';
import { VoteActiveState } from 'components/posts/UpvoteSection';
import moment from 'moment';
import { useAuth } from 'providers/authProvider';
import { ReactEventHandler } from 'react';
import { useVoteComment } from 'services/comments';
import { IUserResponse } from 'services/user';
import { Loader } from 'tabler-icons-react';
import { ICommentDetail } from 'types/commentType';

interface ICommentContainerProps {
  comment: ICommentDetail,
  activeState: VoteActiveState
}

function CommentDisplay({ commentBody }: { commentBody: string }) {
  return (
    <RichTextEditor
      sx={(theme) => ({
        backgroundColor: theme.fn.rgba(theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2], 0.8),
        border: 0,
      })}
      readOnly
      value={commentBody}
      onChange={() => { }}
    />
  );
}

function CommentContainer({ comment, activeState }: ICommentContainerProps) {
  const voteCommentMutation = useVoteComment();
  const auth = useAuth();
  const commentedAt = Date.parse(comment.commented_at);
  const commentedTimeAgo = moment(commentedAt).fromNow();

  const handleUpvote: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    if (auth?.data?.user) voteCommentMutation.mutate({ id: comment._id, dir: 1 });
    else {
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
    if (auth?.data?.user) voteCommentMutation.mutate({ id: comment._id, dir: -1 });
    else {
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

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        padding: theme.spacing.md,
      })}
    >
      <Avatar
        radius="xl"
        color="blue"
      >
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
        </Container>
      </Stack>
    </Box>
  );
}

interface ICommentSectionProps {
  comments: ICommentDetail[],
  user: IUserResponse | undefined,
}

export default function CommentSection({ comments, user }: ICommentSectionProps) {
  return (
    <>
      <Space h="lg" />
      {
        comments.map(
          // eslint-disable-next-line no-underscore-dangle
          (comment: ICommentDetail) => {
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

            return (
              <CommentContainer
                key={comment._id}
                comment={comment}
                activeState={activeState}
              />
            );
          },
        )
      }
    </>
  );
}
