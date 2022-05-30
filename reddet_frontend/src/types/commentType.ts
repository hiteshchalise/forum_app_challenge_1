export default interface IComment {
  _id: string,
}

export interface ICommentDetail extends IComment {
  comment_body: string,
  commented_by: string,
  commented_at: string,
  commented_to: string,
  upvotes: number
}
