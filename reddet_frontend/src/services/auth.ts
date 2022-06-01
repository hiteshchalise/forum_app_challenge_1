import Axios, { AxiosError } from 'axios';
import { useAuth } from 'providers/authProvider';
import { useMutation, useQueryClient } from 'react-query';
import { getErrorMessage } from 'types/errorTypes';
import {
  IRegisterUser, IRegisterUserResponse, ILoginUser,
  ILoginUserResponse,
} from 'types/userType';
import axios from '../lib/axios';
import storage from '../utils/storage';

interface IRegisterUserError {
  error: string
}

async function registerUser(data: IRegisterUser): Promise<IRegisterUserResponse> {
  try {
    const response = await axios.post('/api/users', data);
    return response.data as IRegisterUserResponse;
  } catch (error: AxiosError | unknown) {
    let message;
    if (Axios.isAxiosError(error)) {
      message = (error.response?.data as IRegisterUserError).error;
    } else {
      message = getErrorMessage(error);
    }
    if (!message) throw error;
    else throw Error(message as string);
  }
}

const useRegisterUserMutation = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation(
    (data: IRegisterUser) => registerUser(data),
    {
      onSuccess: (data) => {
        const user = {
          token: data.authToken,
          user: {
            // eslint-disable-next-line no-underscore-dangle
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            register_date: '',
            posts: [],
            voted_posts: [],
            voted_comments: [],
          },
        };
        storage.setUser(user);
        auth?.setAuthData({ ...user });
        queryClient.setQueryData(['user'], data.user);
      },
    },
  );
};

interface ILoginUserError {
  error: string
}

async function loginUser(data: ILoginUser): Promise<ILoginUserResponse> {
  try {
    const response = await axios.post('/api/auth', data);
    return response.data as ILoginUserResponse;
  } catch (error: AxiosError | unknown) {
    let message;
    if (Axios.isAxiosError(error)) {
      message = (error.response?.data as ILoginUserError).error;
    } else {
      message = getErrorMessage(error);
    }
    if (!message) throw error;
    else throw Error(message as string);
  }
}

export const useLoginUserMutation = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation(
    (data: ILoginUser) => loginUser(data),
    {
      onSuccess: (data) => {
        const user = {
          token: data.authToken,
          user: {
            // eslint-disable-next-line no-underscore-dangle
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            register_date: '',
            posts: [],
            voted_posts: [],
            voted_comments: [],
          },
        };
        storage.setUser(user);
        auth?.setAuthData({ ...user });
        queryClient.setQueryData(['user'], data.user);
      },
    },
  );
};

export default useRegisterUserMutation;
