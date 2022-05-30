import { IPostDetail } from 'types/postType';

interface IPostDetailsBodyProps {
  postData: IPostDetail
}

export default function PostDetailsBody({ postData }: IPostDetailsBodyProps) {
  return <div>Post Details Body</div>;
}
