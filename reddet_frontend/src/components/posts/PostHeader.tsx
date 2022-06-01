import moment from 'moment';
import {
  Avatar, Space, Badge, Text, Center,
} from '@mantine/core';

interface IPostHeaderProps {
  posted_at: string,
  postedBy: string,
}

export default function PostHeader({ posted_at, postedBy }: IPostHeaderProps) {
  const postedAt = Date.parse(posted_at);
  const postedTimeAgo = moment(postedAt).fromNow();
  return (
    <Center inline pt="xs" pl="xs">
      <Avatar
        radius="xl"
        sx={() => ({
          display: 'inline-block',
        })}
      >
        {postedBy.substring(2, 3).toUpperCase()}
      </Avatar>
      <Space w="sm" />
      <Text weight={500}>{postedBy}</Text>
      <Space w="sm" />
      <Badge>{postedTimeAgo}</Badge>
    </Center>
  );
}
