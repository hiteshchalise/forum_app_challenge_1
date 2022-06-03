import {
  AppShell,
  Header,
  Aside,
  Text,
  MediaQuery,
  useMantineTheme,
  Space,
  Button,
  List,
} from '@mantine/core';
import MainLogo from 'assets/MainLogo';
import { useAuth } from 'providers/authProvider';
import { ErrorBoundary } from 'react-error-boundary';
import { Link } from 'react-router-dom';
import useUserQuery from 'services/user';
import AuthButtons from './AuthButtons';
import LoggedInUserDisplay from './LoggedInUserDisplay';
import PostsDisplay from './posts/PostsDisplay';

const asideText = `This is a clone of reddit in the making, there are lots of features missing,
and I'll be adding them eventually. For now here's what you can do:
`;

function ErrorFallback() {
  return <div>Something went wrong!!</div>;
}

export default function Home() {
  const theme = useMantineTheme();
  const auth = useAuth();

  const hasUser = auth?.data && auth.data.user;
  const displayAuthButtons = !auth?.isLoading && !hasUser;

  const userQuery = useUserQuery(auth?.data?.user.id);

  return (
    <AppShell
      padding={48}
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      asideOffsetBreakpoint="sm"
      fixed
      aside={(
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 300, lg: 300 }}>
            <Text size="md" weight="bold">Welcome to reddet!</Text>
            <Space h="sm" />
            <Text size="sm">
              {asideText}
            </Text>
            <Space h="sm" />
            <List size="sm">
              <List.Item> Watch the posts and comments without logging in. </List.Item>
              <List.Item> Sign up and Log in. </List.Item>
              <List.Item> Create a post if you are logged in. </List.Item>
              <List.Item> Upvote / Downvote posts if you are logged in. </List.Item>
              <List.Item> Comment with rich text. </List.Item>
              <List.Item> Upvote / Downvote comments. </List.Item>
            </List>
            <Space h="lg" />
            {hasUser ? (
              <Button
                component={Link}
                to="/postSubmit"
              >
                Add a post.
              </Button>
            ) : <Button disabled>Add a post.</Button>}
          </Aside>
        </MediaQuery>
      )}
      header={(
        <Header height={70} p="md" px="lg">
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Space w="lg" />
            <MainLogo />
            <Space w="lg" />
            <Text size="xl" weight={500}>Reddet:  A clone of reddit</Text>
            {
              auth?.data
              && auth.data.user
              && <LoggedInUserDisplay user={auth.data.user} />
            }
            {displayAuthButtons && <AuthButtons />}
          </div>
        </Header>
      )}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <PostsDisplay user={userQuery.data} />
      </ErrorBoundary>
    </AppShell>
  );
}
