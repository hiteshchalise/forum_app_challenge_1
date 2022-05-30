import { LoadingOverlay } from '@mantine/core';

export default function Loading() {
  return (
    <div style={{
      position: 'relative',
      height: 'inherit',
      width: 'inherit',
    }}
    >
      <LoadingOverlay visible />
    </div>
  );
}
