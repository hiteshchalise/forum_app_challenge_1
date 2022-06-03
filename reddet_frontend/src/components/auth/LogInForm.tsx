import {
  Box,
  Button,
  Group,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core';
import { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { Mail, Lock } from 'tabler-icons-react';
import { useLoginUserMutation } from 'services/auth';
import { getErrorMessage } from 'types/errorTypes';
import { showNotification } from '@mantine/notifications';

export default function LogInForm() {
  const loginUserMutation = useLoginUserMutation((username) => {
    showNotification({
      id: 'login',
      autoClose: 5000,
      disallowClose: true,
      title: 'Login Successful',
      message: `Welcome ${username} and enjoy discussions!`,
      color: 'blue',
    });
  });

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must have at least 6 letters' : null),
    },
  });

  const emailValue = form.getInputProps('email').value as string;
  useEffect(() => {
    form.clearFieldError('email');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailValue]);

  const passwordValue = form.getInputProps('password').value as string;
  useEffect(() => {
    form.clearFieldError('password');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordValue]);

  type FormValues = typeof form.values;

  const handleLoginSubmit = (values: FormValues) => {
    loginUserMutation.mutate({ ...values });
  };

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={form.onSubmit((values) => handleLoginSubmit(values))}>
        <TextInput
          required
          label="Email"
          placeholder="your@email.com"
          icon={(
            <Mail
              size={18}
              strokeWidth={1}
              color="gray"
            />
          )}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps('email')}
        />
        <PasswordInput
          required
          label="password"
          placeholder="yourpassword"
          icon={(
            <Lock
              size={18}
              strokeWidth={1}
              color="gray"
            />
          )}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps('password')}
        />
        <Text color="red" size="xs">
          {loginUserMutation.isError ? getErrorMessage(loginUserMutation.error) : ''}
        </Text>
        <Group position="right" mt="md">
          <Button type="submit" disabled={loginUserMutation.isLoading}>Submit</Button>
        </Group>
      </form>
    </Box>
  );
}
