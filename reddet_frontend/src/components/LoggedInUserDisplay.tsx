import {
  Text,
  Avatar,
  Box,
  Menu,
  Group,
} from '@mantine/core';
import { useAuth } from 'providers/authProvider';
import { Link } from 'react-router-dom';
import { Logout, Send } from 'tabler-icons-react';

export interface ILoggedInUserDisplayProps {
  user: {
    name: string,
    email: string
  }
}

export default function LoggedInUserDisplay({ user }: ILoggedInUserDisplayProps) {
  const auth = useAuth();

  const handleLogout = () => {
    auth?.removeAuthData();
  };

  return (
    <Box sx={(theme) => ({
      marginLeft: 'auto',
      marginRight: 0,
      display: 'flex',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3],
      borderStyle: 'solid',
      borderRadius: theme.spacing.sm,
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
      paddingLeft: theme.spacing.xs,
      paddingRight: theme.spacing.xs,
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        padding: 0,
      },
    })}
    >
      <Menu
        control={(
          <Group>
            <Group
              sx={(theme) => ({
                [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
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
                [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
                  display: 'inline-block',
                },
              })}
              radius="xl"
              color="red"
            >
              {user.name.substring(0, 2)}
            </Avatar>
          </Group>
        )}
        sx={{
          '&:Hover': {
            cursor: 'pointer',
          },
        }}
      >
        <Menu.Label>
          Logged in as:
          {' '}
          {user.name}
        </Menu.Label>
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
        <Menu.Item
          icon={<Logout size={24} color="gray" />}
          onClick={handleLogout}
        >
          Log Out
        </Menu.Item>
      </Menu>
    </Box>
  );
}
