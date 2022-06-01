/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-indent */
import {
  LoadingOverlay,
} from '@mantine/core';
import { useQuery } from 'react-query';
import { IUserResponse } from 'services/user';
import { getPosts } from '../../services/posts';
import PostItem from './PostItem';
import { VoteActiveState } from './UpvoteSection';

export default function PostDisplay({ user }: { user: IUserResponse | undefined }) {
  const { data, status } = useQuery('posts', getPosts);

  if (status === 'loading') {
    return (
      <div>
        <LoadingOverlay visible={status === 'loading'} />
      </div>
    );
  }
  if (status === 'error') {
    return <div>Error!!</div>;
  }
  if (!data) return <div>empty posts!!</div>;
  return (
    <>
      {
        data.map((item) => {
          let activeState: VoteActiveState; // 1 for up 2 for neutral 3 for down
          if (!user || (user && user.voted_posts.length === 0)) {
            activeState = VoteActiveState.Neutral;
          } else if (user.voted_posts.find(((post) => post._id === item._id))) {
            activeState = VoteActiveState.Up;
          } else {
            activeState = VoteActiveState.Down;
          }
          return (
            <PostItem
              key={item._id}
              post={item}
              activeState={activeState}
            />
          );
        })
      }
    </ >
  );
}
