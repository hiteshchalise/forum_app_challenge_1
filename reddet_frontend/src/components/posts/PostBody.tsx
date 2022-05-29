import {
  Container, Space, Spoiler, Text,
} from '@mantine/core';
import {
  ForwardedRef, ReactEventHandler, RefObject, useRef, useState,
} from 'react';

interface IPostBodyProps {
  post_title: string,
  post_body: string,
}

export default function PostBody({ post_title, post_body }: IPostBodyProps) {
  const controlRef = useRef() as RefObject<HTMLButtonElement>;

  const handleSpoilerClick: ReactEventHandler = (e) => {
    e.stopPropagation();
    controlRef.current?.click();
  };

  return (
    <Container
      py="sm"
    >
      <Text size="lg" weight={700}>{post_title}</Text>
      <Space h="sm" />
      <Spoiler controlRef={controlRef} maxHeight={100} hideLabel="hide" showLabel="show more" onClick={handleSpoilerClick}>
        {post_body}
      </Spoiler>
    </Container>
  );
}
