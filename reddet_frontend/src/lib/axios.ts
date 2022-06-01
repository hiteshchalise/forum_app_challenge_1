import Axios, { AxiosRequestConfig } from 'axios';
import storage from 'utils/storage';
import config from '../config/config';

/* eslint-disable no-param-reassign */
const authRequestInterceptor = (axiosRequestConfig: AxiosRequestConfig) => {
  const token = storage.getAuth() ? storage.getAuth().token : null;
  if (axiosRequestConfig.headers === undefined) axiosRequestConfig.headers = {};
  if (token) {
    axiosRequestConfig.headers.post['x-auth-token'] = `${token}`;
  }
  axiosRequestConfig.headers.Accept = 'application/json';
  return axiosRequestConfig;
};

const axios = Axios.create({
  baseURL: config.API_URL,
});

axios.interceptors.request.use(authRequestInterceptor);
// axios.interceptors.response.use((response) => response.data, (error) => {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//   const message: string = error.response?.data?.error as string || error.message as string;
//   console.error(message);
//   // Todo: send notification of error message
//   return Promise.reject(error);
// });

export default axios;
