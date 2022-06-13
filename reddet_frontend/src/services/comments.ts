// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { ICommentDetail } from 'types/commentType';
import { getErrorMessage } from 'types/errorTypes';
import axios from '../lib/axios';

interface ISubmitCommentResponse {
  _id: string,
  post_title: string,
  post_body: string,
  posted_by: string,
  posted_at: string,
  comments: ICommentDetail[],
  upvotes: number
}

interface IVoteCommentResponse {
  upvotes: number
}

export async function getCommentDetail(postId: string, commentId: string): Promise<ICommentDetail> {
  try {
    const response = await axios.get(`/api/posts/${postId}/comments/${commentId}`);
    return response.data as ICommentDetail;
  } catch (error: AxiosError | unknown) {
    let message;
    if (Axios.isAxiosError(error)) {
      message = (error.response?.data as { error: string }).error;
    } else {
      message = getErrorMessage(error);
    }
    if (!message) throw error;
    else throw Error(message as string);
  }
}

async function submitComment(postId: string, data: string): Promise<ISubmitCommentResponse> {
  try {
    const response = await axios.post(`/api/posts/${postId}/comments/`, { comment_body: data });
    return response.data as ISubmitCommentResponse;
  } catch (error: AxiosError | unknown) {
    let message;
    if (Axios.isAxiosError(error)) {
      message = (error.response?.data as { error: string }).error;
    } else {
      message = getErrorMessage(error);
    }
    if (!message) throw error;
    else throw Error(message as string);
  }
}

async function submitReplyOnComment(
  postId: string,
  commentId: string,
  data: string,
): Promise<ISubmitCommentResponse> {
  try {
    const response = await axios.post(`/api/posts/${postId}/comments/${commentId}`, { comment_body: data });
    return response.data as ISubmitCommentResponse;
  } catch (error: AxiosError | unknown) {
    let message;
    if (Axios.isAxiosError(error)) {
      message = (error.response?.data as { error: string }).error;
    } else {
      message = getErrorMessage(error);
    }
    if (!message) throw error;
    else throw Error(message as string);
  }
}

async function voteComment(id: string, dir: number) {
  const response = await axios.post('/api/posts/upvote/comment', { commentId: id, dir });
  return response.data as IVoteCommentResponse;
}

export const useCommentMutation = (onSuccessCallback: ()=>void) => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: { postId: string, value: string }) => submitComment(data.postId, data.value),
    {
      onSuccess: async (response, variables) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { _id, ...rest } = response;
        const postBody = { id: _id, ...rest };
        queryClient.setQueryData(['posts', variables.postId], postBody);
        await queryClient.invalidateQueries(['user']);
        await queryClient.invalidateQueries(['posts']);
        onSuccessCallback();
      },
    },
  );
};

export const useReplyOnCommentMutation = (onSuccessCallback: ()=>void) => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: {
      postId: string, commentId: string, value: string
    }) => submitReplyOnComment(data.postId, data.commentId, data.value),
    {
      onSuccess: async (response, variables) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { _id, ...rest } = response;
        const postBody = { id: _id, ...rest };
        queryClient.setQueryData(['posts', variables.postId], postBody);
        await queryClient.invalidateQueries(['user']);
        await queryClient.invalidateQueries(['posts']);
        await queryClient.invalidateQueries(['comment']);
        onSuccessCallback();
      },
    },
  );
};

export const useVoteComment = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { id: string, dir: number }) => voteComment(data.id, data.dir),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['posts']);
        await queryClient.invalidateQueries(['user']);
      },
    },
  );
};

export default useCommentMutation;
