/* eslint-disable react/jsx-indent */
import {
  LoadingOverlay,
} from '@mantine/core';
import { useQuery } from 'react-query';
import { getPosts } from '../../services/posts';
import PostItem from './PostItem';

export default function PostDisplay() {
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
        data.map((item) => (
          // eslint-disable-next-line no-underscore-dangle
          <PostItem key={item._id} post={item} />
        ))
      }
    </ >
  );
}
