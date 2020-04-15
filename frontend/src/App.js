import React, { useContext, useState } from "react";
import Cookies from "js-cookie";
import Nav from "./components/nav";
import Body from "./components/body";
import Login from "./components/login";
import Register from "./components/register";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import { UserContext } from "./userContext";

const App = (props) => {
  const [user, setUser] = useContext(UserContext);
  const [loginTried, setLoginTried] = useState(false);

  console.log(
    "User token: " +
      user.token +
      "  refresh token: " +
      Cookies.get("refreshToken")
  );

  if (user.token === "" && !loginTried) {
    setLoginTried(true);
    fetch("http://localhost:5000/api/auth/refresh", {
      method: "POST",
      headers: {
        credentials: "same-origin",
      },
    })
      .then((res) => {
        res.json();
      })
      .then((result) => {
        console.log("loggedIn via token: ", result);
        if (result !== undefined) {
          setUser({ token: result.token, loggedIn: true, user: result.user });
          console.log(user);
        }
      })
      .catch(setUser({ token: "", loggedIn: false, user: {} }));
  }

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
          <Route path="/">
            <Nav />
            <Body />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
