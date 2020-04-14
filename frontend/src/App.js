import React, {useContext} from "react";
import Cookies from "js-cookie";
import Nav from "./components/nav";
import Body from "./components/body";
import Login from "./components/login";
import Register from "./components/register";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import { UserContext } from "./userContext";

const App = (props) => {
  const [user , setUser] = useContext(UserContext);
  console.log("User token: " + user.token + "  refresh token: " + Cookies.get("refreshToken"));
  if (user.token === "" && Cookies.get("refreshToken")) {
    fetch("http://localhost:5000/api/auth/refresh")
      .then((res) => {
        console.log(res);
        res.json();
      })
      .then((result) => {
        console.log("loggedIn via token: ", result);
        setUser({ token: result.token, loggedIn: true, user: result.user });
      })
      .catch(
        setUser({ token: "", loggedIn: false, user: {} })
      );
  }

  const loginCallback = (email, password) => {
    fetch("http://localhost:5000/api/auth/", {
      method: "POST",
      headers: {  
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((result)=>{
        console.log("loggedIn via email password: ", result.user);
        setUser({ token: result.token, loggedIn: true, user: result.user });
      })
      .catch(setUser({ token: "", loggedIn: false, user: {} }));
  };


  return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/login" >
              <Login loginCallback={loginCallback}/>
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
