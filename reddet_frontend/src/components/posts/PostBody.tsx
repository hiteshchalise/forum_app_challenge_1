import {
  Container, Space, Spoiler, Text,
} from '@mantine/core';

interface IPostBodyProps {
  post_title: string,
  post_body: string,
}

export default function PostBody({ post_title, post_body }: IPostBodyProps) {
  return (
    <Container
      py="sm"
    >
      <Text size="lg" weight={700}>{post_title}</Text>
      <Space h="sm" />
      <Spoiler maxHeight={100} hideLabel="hide" showLabel="show">
        {post_body}
      </Spoiler>
    </Container>
  );
}
