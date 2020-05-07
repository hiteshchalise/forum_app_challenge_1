import React, { useContext, useState, useEffect } from "react";
import Nav from "./components/nav";
import Body from "./components/body";
import Login from "./components/login";
import Register from "./components/register";
import CreatePost from "./components/createPost";
import PostDetail from "./components/postDetail";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import api from "./utils/api";

import "./App.css";
import { StoreContext } from "./storeContext";
import { userCreator } from "./store/auth";


const App = (props) => {
  const store = useContext(StoreContext);
  const user = store.getState();
  const [loginTried, setLoginTried] = useState(false);

  useEffect(() => {
    if (!loginTried && user.name === undefined) {
      setLoginTried(true);
      api("/api/auth/refresh/", { method: "GET", withCredentials: true })
        .then((result) => {
          console.log("App: useEffect: userState: ", store.getState());
          const { id, name, email } = result.data.user;
          store.dispatch(userCreator({ id, name, email, token: result.data.token }));
          console.log("App: useEffect: userState: ", store.getState());
        })
        .catch((error) => {
          console.log(error);
          // setUser({ token: "", loggedIn: false, user: "" });
        });
    }
  }, [store, loginTried, user.name]);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/createPost">
            <CreatePost />
          </Route>
          <Route path="/postDetail">
            <PostDetail />
          </Route>
          <Route exact path="/">
            <Nav />
            <Body />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
