import {
  AppShell,
  Header,
  Aside,
  Text,
  MediaQuery,
  useMantineTheme,
  Space,
} from '@mantine/core';
import MainLogo from 'assets/MainLogo';
import { useAuth } from 'providers/authProvider';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import useUserQuery from 'services/user';
import AuthButtons from './AuthButtons';
import LoggedInUserDisplay from './LoggedInUserDisplay';
import PostsDisplay from './posts/PostsDisplay';

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
          <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
            <Text>Aside</Text>
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
