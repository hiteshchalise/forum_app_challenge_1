import {
  AppShell,
  Header,
  Aside,
  Text,
  MediaQuery,
  useMantineTheme,
} from '@mantine/core';
import MainLogo from 'assets/MainLogo';
import { ErrorBoundary } from 'react-error-boundary';
import PostsDisplay from './posts/PostsDisplay';

function ErrorFallback() {
  return <div>Something went wrong!!</div>;
}

export default function Home() {
  const theme = useMantineTheme();
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
        <Header height={70} p="md">
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <MainLogo />
            <Text size="xl" weight={500}>Reddet: A clone of reddit</Text>
          </div>
        </Header>
      )}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <PostsDisplay />
      </ErrorBoundary>
    </AppShell>
  );
}
