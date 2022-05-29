import { Stack } from '@mantine/core';
import UpvoteLogo from '../../assets/UpvoteLogo';
import DownvoteLogo from '../../assets/DownvoteLogo';

interface IUpvoteProps {
  upvotes: number
}

export default function UpvoteSection({ upvotes }: IUpvoteProps) {
  return (
    <Stack spacing="xs" align="center" justify="flex-start" pt="sm">
      <UpvoteLogo active />
      {upvotes}
      <DownvoteLogo active />
    </Stack>
  );
}
