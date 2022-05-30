import IComment, { ICommentDetail } from './commentType';

export default interface IPost {
  _id: string,
  post_title: string,
  post_body: string,
  posted_at: string,
  comments: IComment[]
  upvotes: number,
}

export interface IPostDetail extends IPost {
  comments: ICommentDetail[],
}
