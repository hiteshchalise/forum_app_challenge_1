import {
  Container, createStyles, Divider, Space, Text,
} from '@mantine/core';
import DocumentIcon from 'assets/DocumentIcon';
import DownvoteLogo from 'assets/DownvoteLogo';
import UpvoteLogo from 'assets/UpvoteLogo';
import { IPostDetail } from 'types/postType';

interface IPostDetailsHeaderProps {
  postData: IPostDetail
}

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: '4%',
    paddingRight: '4%',
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function PostDetailsHeader({ postData }: IPostDetailsHeaderProps) {
  const { classes } = useStyles();
  const handleUpvote = () => {
    console.log('upvote!!');
  };
  const handleDownvote = () => {
    console.log('upvote!!');
  };
  return (
    <>
      <Space h="md" />
      <Container className={classes.header}>
        <Divider sx={{ height: '20px' }} orientation="vertical" variant="dotted" />
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
        <Divider sx={{ height: '20px' }} orientation="vertical" variant="dotted" />
        <DocumentIcon />
        <Text weight={500}>{postData.post_title}</Text>
      </Container>
      <Space h="md" />
    </>
  );
}
