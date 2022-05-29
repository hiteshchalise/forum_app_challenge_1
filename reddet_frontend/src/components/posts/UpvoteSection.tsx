import { Stack } from '@mantine/core';
import { ReactEventHandler } from 'react';
import UpvoteLogo from '../../assets/UpvoteLogo';
import DownvoteLogo from '../../assets/DownvoteLogo';

interface IUpvoteProps {
  upvotes: number
}

export default function UpvoteSection({ upvotes }: IUpvoteProps) {
  const handleUpvote: ReactEventHandler = (e) => {
    e.stopPropagation();
    console.log('upvote!!!');
  };

  const handleDownvote: ReactEventHandler = (e) => {
    e.stopPropagation();
    console.log('downvote!!!');
  };

  return (
    <Stack spacing="xs" align="center" justify="flex-start" pt="sm">
      <UpvoteLogo active onClickListener={handleUpvote} />
      {upvotes}
      <DownvoteLogo active onClickListener={handleDownvote} />
    </Stack>
  );
}
