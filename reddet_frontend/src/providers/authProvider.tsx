import {
  createContext, ReactElement, useContext, useEffect, useState,
} from 'react';
import storage, { IAuth } from 'utils/storage';

interface IAuthContextType {
  data: IAuth | null,
  setAuthData: ((authData: IAuth) => void)
  removeAuthData: () => void,
}

const authContext = createContext<IAuthContextType | null>(null);

interface IAuthProviderProp {
  children: ReactElement
}

export function useProvideAuth() {
  const [auth, setAuth] = useState<IAuth | null>(null);

  useEffect(() => {
    setAuth(storage.getAuth());
  }, []);

  function setAuthData(authData: IAuth) {
    setAuth(authData);
  }

  function removeAuthData() {
    setAuth(null);
  }

  return {
    data: auth,
    setAuthData,
    removeAuthData,
  } as IAuthContextType;
}

export function AuthProvider({ children }: IAuthProviderProp) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth() {
  return useContext(authContext);
}
