import { Stack } from '@mantine/core';
import { ReactEventHandler } from 'react';
import { Loader } from 'tabler-icons-react';
import UpvoteLogo from '../../assets/UpvoteLogo';
import DownvoteLogo from '../../assets/DownvoteLogo';

export enum VoteActiveState {
  Up = 1,
  Neutral,
  Down,
}

interface IUpvoteProps {
  upvotes: number,
  handleUpvote: ReactEventHandler
  handleDownvote: ReactEventHandler,
  activeState: VoteActiveState,
  isLoading: boolean
}

export default function UpvoteSection({
  upvotes,
  handleUpvote,
  handleDownvote,
  activeState,
  isLoading,
}: IUpvoteProps) {
  return (
    <Stack spacing="xs" align="center" justify="flex-start" pt="sm">
      <UpvoteLogo active={activeState === 1} onClickListener={handleUpvote} />
      {isLoading ? <Loader color="gray" size={18} /> : upvotes}
      <DownvoteLogo active={activeState === 3} onClickListener={handleDownvote} />
    </Stack>
  );
}
