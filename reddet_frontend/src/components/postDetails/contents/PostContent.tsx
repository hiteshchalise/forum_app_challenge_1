import { Container, Space, Text } from '@mantine/core';

interface IPostContentProps {
  post_title: string,
  post_body: string,
}

export default function PostContent({ post_title, post_body }: IPostContentProps) {
  return (
    <Container
      py="sm"
    >
      <Text size="lg" weight={700}>{post_title}</Text>
      <Space h="sm" />
      {post_body}
    </Container>
  );
}
