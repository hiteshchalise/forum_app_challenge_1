import {
  Box,
  Button,
  Space,
} from '@mantine/core';
import { ReactEventHandler } from 'react';

export default function LoginSignupButtons() {
  const handleLoginClick: ReactEventHandler = (ev) => {
    ev.stopPropagation();
  };

  const handleSignupClick: ReactEventHandler = (ev) => {
    ev.stopPropagation();
  };

  return (
    <Box sx={(theme) => ({
      display: 'flex',
      flexDirection: 'row',
      marginLeft: 'auto',
      marginRight: theme.spacing.lg,
    })}
    >
      <Button radius="xl" variant="outline" onClick={handleLoginClick}>Log In</Button>
      <Space w="sm" />
      <Button radius="xl" variant="filled" onClick={handleSignupClick}>Sign Up</Button>
    </Box>
  );
}
