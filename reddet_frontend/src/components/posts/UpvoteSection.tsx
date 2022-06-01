import { Stack } from '@mantine/core';
import { ReactEventHandler } from 'react';
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
  activeState: VoteActiveState
}

export default function UpvoteSection({
  upvotes,
  handleUpvote,
  handleDownvote,
  activeState,
}: IUpvoteProps) {
  return (
    <Stack spacing="xs" align="center" justify="flex-start" pt="sm">
      <UpvoteLogo active={activeState === 1} onClickListener={handleUpvote} />
      {upvotes}
      <DownvoteLogo active={activeState === 3} onClickListener={handleDownvote} />
    </Stack>
  );
}
