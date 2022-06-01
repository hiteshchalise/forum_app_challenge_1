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
import { Mail, Lock, Send } from 'tabler-icons-react';
import useRegisterUserMutation from 'services/auth';
import { getErrorMessage } from 'types/errorTypes';

interface ISignUpFormProps {
  onSuccess: () => void,
  // onError: (error: string) => void,
}

export default function SignupForm({ onSuccess }: ISignUpFormProps) {
  const registerUserMutation = useRegisterUserMutation();

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },

    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      email: (value) => (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must have at least 6 letters' : null),
    },
  });

  const nameValue = form.getInputProps('name').value as string;
  useEffect(() => {
    form.clearFieldError('name');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameValue]);

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

  const handleSignUpSubmit = (values: FormValues) => {
    registerUserMutation.mutate({ ...values });
  };

  if (registerUserMutation.isSuccess) onSuccess();

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={form.onSubmit((values) => handleSignUpSubmit(values))}>
        <TextInput
          required
          label="Name"
          placeholder="name"
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps('name')}
        />
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
          {registerUserMutation.isError ? getErrorMessage(registerUserMutation.error) : ''}
        </Text>
        <Group position="right" mt="md">
          <Button
            type="submit"
            loading={registerUserMutation.isLoading}
            leftIcon={(
              <Send
                size={24}
                strokeWidth={1}
                color="white"
              />
            )}
          >
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
}
