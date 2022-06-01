import {
  Text, Space,
  Avatar,
  Box,
} from '@mantine/core';

export interface ILoggedInUserDisplayProps {
  user: {
    name: string,
  }
}

export default function LoggedInUserDisplay({ user }: ILoggedInUserDisplayProps) {
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
      <Text>{user.name}</Text>
    </Box>
  );
}
