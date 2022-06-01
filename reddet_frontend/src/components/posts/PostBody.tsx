import {
  Container, Space, Spoiler, Text,
} from '@mantine/core';
import {
  ReactEventHandler, RefObject, useRef, useState,
} from 'react';

interface IPostBodyProps {
  post_title: string,
  post_body: string,
}

export default function PostBody({ post_title, post_body }: IPostBodyProps) {
  const controlRef = useRef() as RefObject<HTMLButtonElement>;
  const [spoilerVisible, setSpoilerVisible] = useState(false);

  const handleSpoilerClick: ReactEventHandler = (e) => {
    // Clicking the post_body will trigger this event,
    // we'll only stop propagation on actual button click,
    // this triggers default behaviour of Spoiler component
    // and setSpoilerVisible, else parent component's
    // event will be triggered and open's post details.
    if (e.target === controlRef.current) {
      e.stopPropagation();
      setSpoilerVisible(!spoilerVisible);
    }
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
