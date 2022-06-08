export default interface IComment {
  _id: string,
}

interface ICommentedBy {
  _id: string,
  name: string,
  email: string
}

export interface ICommentDetail extends IComment {
  comment_body: string,
  commented_by: ICommentedBy,
  commented_at: string,
  commented_to: string,
  child_comments: ICommentDetail []
  upvotes: number
}
