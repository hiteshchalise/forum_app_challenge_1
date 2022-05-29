import IComment from './commentType';

export default interface IPost {
  _id: string,
  post_title: string,
  post_body: string,
  posted_at: string,
  comments: IComment[]
  upvotes: number,
}
