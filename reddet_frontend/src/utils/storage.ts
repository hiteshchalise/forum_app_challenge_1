import IComment from 'types/commentType';
import IPost from 'types/postType';

const STORAGE_PREFIX = 'reddet_react_';

export interface IAuth {
  token: string,
  user: {
    id: string,
    name: string,
    email: string,
    register_date: string,
    posts: IPost[],
    voted_posts: IPost[],
    voted_comments: IComment[]
  }
}

const storage = {
  setUser: (auth: IAuth) => {
    window.localStorage.setItem(
      `${STORAGE_PREFIX}auth`,
      JSON.stringify(auth),
    );
  },
  getAuth: () => {
    const auth = JSON.parse(
      window.localStorage.getItem(`${STORAGE_PREFIX}auth`) as string,
    ) as IAuth;
    return auth;
  },
  clearAuth: () => {
    window.localStorage.removeItem(`${STORAGE_PREFIX}auth`);
  },
};

export default storage;
