const STORAGE_PREFIX = 'reddet_react_';

const storage = {
  getToken: () => {
    const token = JSON.parse(
      window.localStorage.getItem(`${STORAGE_PREFIX}token`) as string,
    ) as string;
    return token;
  },
  setToken: (token: string) => {
    window.localStorage.setItem(
      `${STORAGE_PREFIX}token`,
      JSON.stringify(token),
    );
  },
  clearToken: () => {
    window.localStorage.removeItem(`${STORAGE_PREFIX}token`);
  },
};

export default storage;
