/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Modal,
  Space,
} from '@mantine/core';
import { ReactEventHandler, useState } from 'react';
import LogInForm from './auth/LogInForm';
import SignupForm from './auth/SignUpForm';

export default function AuthButtons() {
  const [mode, setMode] = useState<'login' | 'register' | 'close' | 'success'>('close');

  const handleLoginClick: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    setMode('login');
  };

  const handleSignupClick: ReactEventHandler = (ev) => {
    ev.stopPropagation();
    setMode('register');
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

      <Modal
        opened={mode === 'login'}
        onClose={() => setMode('close')}
        title="Log In"
        overflow="inside"
      >
        <LogInForm
          onSuccess={() => { setMode('success'); }}
        />
      </Modal>
      <Modal
        opened={mode === 'register'}
        onClose={() => setMode('close')}
        title="Sign Up"
        overflow="inside"
      >
        <SignupForm
          onSuccess={() => { setMode('success'); }}
        />
      </Modal>
    </Box>
  );
}
