import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Nav from "./components/nav";
import Body from "./components/body";
import Login from "./components/login";
import Register from "./components/register";
import CreatePost from "./components/createPost";
import PostDetail from "./components/postDetail";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import api from "./utils/api";

import "./App.css";
import { userCreator } from "./store/user";


const App = (props) => {
  const user = useSelector(state => state.user || {});
  const dispatch = useDispatch();
  const [loginTried, setLoginTried] = useState(false);

  useEffect(() => {
    if (!loginTried && user.name === undefined) {
      setLoginTried(true);
      api("/api/auth/refresh/",
        {
          method: "GET",
          withCredentials: true
        })
        .then((result) => {
          const { id, name, email, upvoted_posts, upvoted_comments } = result.data.user;
          dispatch(userCreator({ id, name, email, token: result.data.token, upvoted_posts, upvoted_comments }));
        })
        .catch((error) => {
          console.log(error);
          // setUser({ token: "", loggedIn: false, user: "" });
        });
    }
  }, [loginTried, user, dispatch]);

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
          <Route path="/post/:id">
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
