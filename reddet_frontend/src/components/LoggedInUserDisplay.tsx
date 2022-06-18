import {
  Text,
  Avatar,
  Box,
  Menu,
  Group,
  useMantineColorScheme,
  Space,
  Divider,
} from '@mantine/core';
import { useAuth } from 'providers/authProvider';
import { Link } from 'react-router-dom';
import {
  Logout, Send, MoonStars, Sun, ChevronDown,
} from 'tabler-icons-react';

export interface ILoggedInUserDisplayProps {
  user: {
    name: string,
    email: string
  }
}

export default function LoggedInUserDisplay({ user }: ILoggedInUserDisplayProps) {
  const auth = useAuth();
  const mantineColorScheme = useMantineColorScheme();

  const handleLogout = () => {
    auth?.removeAuthData();
  };

  const dark = mantineColorScheme.colorScheme === 'dark';

  return (
    <Box sx={(theme) => ({
      marginLeft: 'auto',
      marginRight: 0,
      display: 'flex',
      alignItems: 'center',
      borderRadius: theme.spacing.xs,
      padding: theme.spacing.xs,
      '&:hover': {
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
      },
    })}
    >
      <Menu
        control={(
          <Group sx={(theme) => ({
            flexWrap: 'nowrap',
            [`@media (max-width: ${theme.breakpoints.md}px)`]: {
              gap: theme.spacing.xs,
            },
          })}
          >
            <Group
              sx={(theme) => ({
                [`@media (max-width: ${theme.breakpoints.md}px)`]: {
                  display: 'none',
                },
              })}
            >
              <Avatar radius="xl" color="red">{user.name.substring(0, 2)}</Avatar>
              <div style={{ flex: 1 }}>
                <Text size="sm" weight={500}>{user.name}</Text>
                <Text size="xs" color="dimmed" lineClamp={1}>{user.email}</Text>
              </div>
            </Group>
            <Avatar
              sx={(theme) => ({
                display: 'none',
                [`@media (max-width: ${theme.breakpoints.md}px)`]: {
                  display: 'inline-block',
                },
              })}
              radius="xl"
              color="red"
            >
              {user.name.substring(0, 2)}
            </Avatar>
            <ChevronDown color="gray" strokeWidth={1} />
          </Group>
        )}
        sx={() => ({
          '&:Hover': {
            cursor: 'pointer',
          },
        })}
      >
        <Menu.Label>
          Logged in as:
          {' '}
          {user.name}
        </Menu.Label>
        {/* <Menu.Item
          icon={<Settings size={24} color="gray" />}
          onClick={() => console.log('Hello')}
        >
          Settings
        </Menu.Item> */}
        <Menu.Item
          icon={<Send size={24} color="gray" />}
          sx={(theme) => ({
            display: 'none',
            [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
              display: 'inline-block',
            },
          })}
          component={Link}
          to="/postSubmit"
        >
          Add a post.
        </Menu.Item>
        <Menu.Label>
          View Options
        </Menu.Label>
        <Menu.Item
          icon={dark ? <Sun size={24} strokeWidth={1.5} />
            : <MoonStars size={24} strokeWidth={1.5} />}
          color={dark ? 'yellow' : 'blue'}
          onClick={() => mantineColorScheme.toggleColorScheme()}
        >
          <Text size="sm" color="gray">
            {dark ? 'Light Mode' : 'Dark Mode'}
          </Text>
        </Menu.Item>
        <Menu.Label>
          <Divider />
        </Menu.Label>
        <Menu.Item
          icon={<Logout size={24} color="gray" />}
          onClick={handleLogout}
        >
          Log Out
        </Menu.Item>
        <Space h="lg" />
      </Menu>
    </Box>
  );
}
