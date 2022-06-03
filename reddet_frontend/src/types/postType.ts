import IComment, { ICommentDetail } from './commentType';

interface IPostedBy {
  _id: string,
  name: string,
  email: string
}

export default interface IPost {
  id: string,
  post_title: string,
  post_body: string,
  posted_at: string,
  posted_by: IPostedBy,
  comments: IComment[]
  upvotes: number,
}

export interface IPostDetail extends IPost {
  comments: ICommentDetail[],
}
