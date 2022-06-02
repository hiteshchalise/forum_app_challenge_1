import { LoadingOverlay } from '@mantine/core';
import { useAuth } from 'providers/authProvider';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface IRequireAuthProps {
  children: ReactNode,
  redirectTo: string
}

function RequireAuth({ children, redirectTo }: IRequireAuthProps) {
  const auth = useAuth();
  if (auth && auth.isLoading) return <LoadingOverlay visible />;
  if (auth && auth.data && auth.data.user) return <div>{children}</div>;
  if (!auth || !auth.data || !auth.data.user) return <Navigate to={redirectTo} />;
  return null;
}

export default RequireAuth;
