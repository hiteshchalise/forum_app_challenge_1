import axios from '../lib/axios';
import IPost from '../types/postType';

export async function getPosts(): Promise<IPost[]> {
  const response = await axios.get('/api/posts/');
  return response.data as IPost[];
}

export function addPosts() {
  return null;
}
