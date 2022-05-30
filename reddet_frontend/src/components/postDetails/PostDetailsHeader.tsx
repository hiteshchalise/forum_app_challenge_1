import {
  Button,
  Container, createStyles, Divider, Space, Text,
} from '@mantine/core';
import CloseIcon from 'assets/CloseIcon';
import DocumentIcon from 'assets/DocumentIcon';
import DownvoteLogo from 'assets/DownvoteLogo';
import UpvoteLogo from 'assets/UpvoteLogo';
import { ReactEventHandler } from 'react';
import { IPostDetail } from 'types/postType';

interface IPostDetailsHeaderProps {
  postData: IPostDetail
}

const useStyles = createStyles(() => ({
  header: {
    paddingLeft: '4%',
    paddingRight: '4%',
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function PostDetailsHeader({ postData }: IPostDetailsHeaderProps) {
  const { classes } = useStyles();
  const handleUpvote: ReactEventHandler = (ev) => {
    ev.stopPropagation();
  };
  const handleDownvote: ReactEventHandler = (ev) => {
    ev.stopPropagation();
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
          active={false}
          onClickListener={handleUpvote}
        />
        <Text px="sm">{postData.upvotes}</Text>
        <DownvoteLogo
          active={false}
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
        >
          Close

        </Button>
      </Container>
      <Space h="md" />
    </>
  );
}
