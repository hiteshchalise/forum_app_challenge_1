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
          let activeState: VoteActiveState;
          if (!user || (user && user.voted_posts.length === 0)) {
            activeState = VoteActiveState.Neutral;
          } else {
            const votedPost = user.voted_posts.find(((post) => post._id === item.id));
            if (!votedPost) {
              activeState = VoteActiveState.Neutral;
            } else if (votedPost.dir === 1) {
              activeState = VoteActiveState.Up;
            } else {
              activeState = VoteActiveState.Down;
            }
          }
          return (
            <PostItem
              key={item.id}
              post={item}
              activeState={activeState}
            />
          );
        })
      }
    </ >
  );
}
