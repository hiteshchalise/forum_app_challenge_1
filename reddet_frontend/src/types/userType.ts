import IComment from './commentType';
import IPost from './postType';

export interface IRegisterUser {
  password: string,
  name: string,
  email: string,
}

export interface IRegisterUserResponse {
  authToken: string,
  user:{
    _id: string,
    name: string,
    email: string,
  }
}

export interface ILoginUser {
  email: string,
  password: string,
}

export interface ILoginUserResponse {
  authToken: string,
  user:{
    _id: string,
    name: string,
    email: string,
    //  upvotedPosts may not populated, list of ids are sent.
    upvoted_post: { _id: string }[]
    upvoted_comment: { _id: string }[]
  }
}
