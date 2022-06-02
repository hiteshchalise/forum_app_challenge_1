/* eslint-disable react/jsx-props-no-spreading */
import {
  TextInput,
  Button, Group,
  Box, Textarea,
  createStyles, Text, Title,
  AppShell, useMantineTheme, Header, Space,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import MainLogo from 'assets/MainLogo';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSubmitPost from 'services/posts';
import { Send } from 'tabler-icons-react';

const useStyles = createStyles((theme) => ({
  container: {
    maxWidth: '50%',
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '70%',
    },
    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      maxWidth: '90%',
    },
  },
}));

export default function PostForm() {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const submitPostMutation = useSubmitPost();
  const { classes } = useStyles();
  const form = useForm({
    initialValues: {
      postTitle: '',
      postBody: '',
    },

    validate: {
      postTitle: (value) => (value.length > 2 ? null : 'Title should have at least 2 characters'),
      postBody: (value) => (value.length > 2 ? null : 'Body should have at least 2 characters'),
    },
  });

  type PostFormValues = typeof form.values;

  const handleSubmit = (values: PostFormValues) => {
    submitPostMutation.mutate({ post_title: values.postTitle, post_body: values.postBody });
  };

  useEffect(() => {
    if (submitPostMutation.isSuccess) navigate('/', { replace: true });
  }, [submitPostMutation.isSuccess, navigate]);

  return (

    <AppShell
      padding={48}
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      header={(
        <Header
          height={70}
          p="md"
          px="lg"
        >
          <Box
            onClick={() => { navigate('/', { replace: true }); }}
            sx={{
              cursor: 'pointer', display: 'flex', alignItems: 'center', height: '100%',
            }}
          >
            <Space w="lg" />
            <MainLogo />
            <Space w="lg" />
            <Text size="xl" weight={500}>Reddet:  A clone of reddit</Text>
          </Box>
        </Header>
      )}
    >
      <Box className={classes.container} mx="auto">
        <Title order={1} mb="lg">Submit your post</Title>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            required
            label="Title"
            placeholder="Title"
            radius="md"
            {...form.getInputProps('postTitle')}
          />

          <Textarea
            required
            label="Body"
            placeholder="Body"
            radius="md"
            minRows={10}
            {...form.getInputProps('postBody')}
          />
          <Group position="right" mt="md">
            <Button
              type="submit"
              leftIcon={<Send size={24} strokeWidth={2} color="white" />}
              loading={submitPostMutation.isLoading}
            >
              Submit
            </Button>
          </Group>
        </form>
      </Box>
    </AppShell>
  );
}
