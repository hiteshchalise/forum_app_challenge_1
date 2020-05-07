import React, { createContext } from "react";
import store from './store/store';

export const StoreContext = createContext();

export const StoreProvider = (props) => {
  // const [user, setUser] = useState({
  //   user: { id: "", userName: "", email: "" },
  //   loggedIn: false,
  //   token: "",
  // });

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
};
