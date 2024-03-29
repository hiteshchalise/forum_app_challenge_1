import {
  createContext, ReactElement, useContext, useEffect, useState,
} from 'react';
import storage, { IAuth } from 'utils/storage';

interface IAuthContextType {
  data: IAuth | null,
  isLoading: boolean,
  setAuthData: ((authData: IAuth) => void)
  removeAuthData: () => void,
}

const authContext = createContext<IAuthContextType | null>(null);

interface IAuthProviderProp {
  children: ReactElement
}

export function useProvideAuth() {
  const [auth, setAuth] = useState<IAuth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAuth(storage.getAuth());
    setIsLoading(false);
  }, []);

  function setAuthData(authData: IAuth) {
    setAuth(authData);
  }

  function removeAuthData() {
    storage.clearAuth();
    setAuth(null);
  }

  return {
    data: auth,
    isLoading,
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
