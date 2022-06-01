import Axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { getErrorMessage } from 'types/errorTypes';
import axios from '../lib/axios';

interface ILoginUserError {
  error: string
}

export interface IUserResponse {
  name: string,
  email: string,
  posts: string[],
  register_date: string,
  voted_posts: {
    _id: string,
    dir: number
  }[],
  voted_comments: {
    _id: string,
    dir: number
  }[],
  id: string,
}

async function getUser(userId: string): Promise<IUserResponse> {
  console.log('useQueryCalledddddd');

  try {
    const response = await axios.get(`/api/users/${userId}`);
    console.log('response from usequery called', response);
    return response.data as IUserResponse;
  } catch (error: AxiosError | unknown) {
    let message;
    if (Axios.isAxiosError(error)) {
      message = (error.response?.data as ILoginUserError).error;
    } else {
      message = getErrorMessage(error);
    }
    console.log('error', message);
    if (!message) throw error;
    else throw Error(message as string);
  }
}

export const useUserQuery = (id: string | undefined) => useQuery(
  ['user', id],
  () => getUser(id as string),
  {
    enabled: !!id,
  },
);

export default useUserQuery;
