import {
  Button,
  Container, createStyles, Divider, Space, Text,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import CloseIcon from 'assets/CloseIcon';
import DocumentIcon from 'assets/DocumentIcon';
import DownvoteLogo from 'assets/DownvoteLogo';
import UpvoteLogo from 'assets/UpvoteLogo';
import { VoteActiveState } from 'components/posts/UpvoteSection';
import { useAuth } from 'providers/authProvider';
import { ReactEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVotePost } from 'services/posts';
import { IPostDetail } from 'types/postType';

interface IPostDetailsHeaderProps {
  postData: IPostDetail,
  activeState: VoteActiveState
}

const useStyles = createStyles(() => ({
  header: {
    paddingLeft: '4%',
    paddingRight: '4%',
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function PostDetailsHeader({ postData, activeState }: IPostDetailsHeaderProps) {
  const { classes } = useStyles();
  const auth = useAuth();
  const votePostMutation = useVotePost();
  const navigate = useNavigate();

  const handleUpvote: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    if (auth?.data?.token) votePostMutation.mutate({ id: postData.id, dir: 1 });
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
    if (auth?.data?.token) votePostMutation.mutate({ id: postData.id, dir: -1 });
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
    <>
      <Space h="md" />
      <Container className={classes.header}>
        <Divider
          sx={{
            height: '24px',
            alignSelf: 'center',
          }}
          orientation="vertical"
          variant="dotted"
        />
        <Space w="lg" />
        <UpvoteLogo
          active={activeState === 1}
          onClickListener={handleUpvote}
        />
        <Text px="sm">{postData.upvotes}</Text>
        <DownvoteLogo
          active={activeState === 3}
          onClickListener={handleDownvote}
        />
        <Space w="lg" />
        <Divider
          sx={{
            height: '24px',
            alignSelf: 'center',
          }}
          orientation="vertical"
          variant="dotted"
        />
        <Space w="sm" />
        <DocumentIcon />
        <Space w="sm" />
        <Text weight={500} lineClamp={1}>
          {postData.post_title}
        </Text>
        <Button
          sx={(theme) => ({
            marginLeft: 'auto',
            backgroundColor: theme.fn.rgba(theme.colors.gray[9], 0),
            '&:hover': {
              backgroundColor: theme.fn.rgba(theme.colors.gray[9], 0.2),
            },
          })}
          leftIcon={<CloseIcon />}
          variant="white"
          compact
          onClick={() => { navigate(-1); }}
        >
          Close

        </Button>
      </Container>
      <Space h="md" />
    </>
  );
}
