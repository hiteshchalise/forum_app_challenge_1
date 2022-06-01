import {
  Text, Space,
  Avatar,
  Box,
  Menu,
} from '@mantine/core';
import { useAuth } from 'providers/authProvider';
import { Logout } from 'tabler-icons-react';

export interface ILoggedInUserDisplayProps {
  user: {
    name: string,
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
    })}
    >
      <Avatar radius="xl" color="red">{user.name.substring(0, 2)}</Avatar>
      <Space w="sm" />

      <Menu
        control={<Text size="sm" styles="bold">{user.name}</Text>}
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
          icon={<Logout size={24} color="gray" />}
          onClick={handleLogout}
        >
          Log Out
        </Menu.Item>
      </Menu>
    </Box>
  );
}
