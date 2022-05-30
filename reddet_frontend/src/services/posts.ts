import axios from '../lib/axios';
import IPost, { IPostDetail } from '../types/postType';

export async function getPosts(): Promise<IPost[]> {
  const response = await axios.get('/api/posts/');
  return response.data as IPost[];
}

export async function getPostDetails(id: string): Promise<IPostDetail> {
  // eslint-disable-next-line no-promise-executor-return
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  await sleep(3000);
  const response = await axios.get(`/api/posts/${id}`);
  return response.data as IPostDetail;
}
