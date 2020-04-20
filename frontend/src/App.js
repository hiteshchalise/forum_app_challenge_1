import React, { useContext, useState,  useEffect } from "react";
import Nav from "./components/nav";
import Body from "./components/body";
import Login from "./components/login";
import Register from "./components/register";
import CreatePost from "./components/createPost";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import api from "./utils/api";

import "./App.css";
import { UserContext } from "./userContext";


const App = (props) => {
  const [user, setUser] = useContext(UserContext);
  const [loginTried, setLoginTried] = useState(false);

  useEffect(() => {
    if (!user.loggedIn && !loginTried) {
      setLoginTried(true);
      api("/api/auth/refresh/", { method: "GET", withCredentials: true })
        .then((result) => {
          setUser({ token: result.data.token, loggedIn: true, user: result.data.user });
        })
        .catch((error) => {
          console.log(error);
          setUser({ token: "", loggedIn: false, user: "" });
        });
    }
  }, [user, setUser, loginTried, setLoginTried]);

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
