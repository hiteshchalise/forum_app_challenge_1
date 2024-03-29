import { useMutation, useQueryClient } from 'react-query';
import IComment from 'types/commentType';
import axios from '../lib/axios';
import { IPostDetail } from '../types/postType';

interface IPostedBy {
  _id: string,
  name: string,
  email: string
}

interface IPostResponse {
  id: string,
  post_title: string,
  post_body: string,
  posted_at: string,
  posted_by: IPostedBy,
  comments: IComment[]
  upvotes: number,
}

interface IVotePostResponse {
  upvotes: number
}

export async function getPosts(): Promise<IPostDetail[]> {
  const response = await axios.get('/api/posts/');
  return response.data as IPostDetail[];
}

export async function getPostDetails(id: string): Promise<IPostDetail> {
  const response = await axios.get(`/api/posts/${id}`);
  return response.data as IPostDetail;
}

async function votePost(id: string, dir: number) {
  const response = await axios.post('/api/posts/upvote', { postId: id, dir });
  return response.data as IVotePostResponse;
}

async function submitPost(post_title: string, post_body: string) {
  const response = await axios.post('/api/posts/', { post_title, post_body });
  return response.data as IPostResponse;
}

export const useVotePost = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { id: string, dir: number }) => votePost(data.id, data.dir),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['posts']);
        await queryClient.invalidateQueries(['user']);
      },
    },
  );
};

export const useSubmitPost = (onSuccessCallback: ()=>void) => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: {
      post_title: string, post_body: string
    }) => submitPost(data.post_title, data.post_body),
    {
      onSuccess: async (response) => {
        queryClient.setQueryData(['posts', response.id], response);
        await queryClient.invalidateQueries(['posts']);
        await queryClient.invalidateQueries(['user']);
        onSuccessCallback();
      },
    },
  );
};

export default useSubmitPost;
