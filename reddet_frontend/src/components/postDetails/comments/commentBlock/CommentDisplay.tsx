/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Box } from '@mantine/core';
import * as sanitize from 'sanitize-html';

export default function CommentDisplay({ commentBody }: { commentBody: string }) {
  return (
    <Box sx={
      () => ({
        border: 0,
      })
    }
    >
      <div dangerouslySetInnerHTML={{ __html: sanitize(commentBody) }} />
    </Box>
  );
}
