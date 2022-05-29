import {
  AppShell,
  Header,
  Aside,
  Text,
  MediaQuery,
  useMantineTheme,
} from '@mantine/core';
import PostsDisplay from './PostsDisplay';

export default function Home() {
  const theme = useMantineTheme();
  return (
    <AppShell
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
            <Text>Reddet: A clone of reddit</Text>
          </div>
        </Header>
      )}
    >
      <PostsDisplay />
    </AppShell>
  );
}
