import React from "react";
// import Cookies from "js-cookie";
import Nav from "./components/nav";
import Body from "./components/body";
import Login from "./components/login";
import Register from "./components/register";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import { UserProvider } from "./userContext";

const App = (props) => {
  // const [user , setUser] = useContext(UserContext);
  // if (this.state.token === "" && Cookies.get("refreshToken")) {
  //   fetch("http://localhost:5000/api/auth/refresh")
  //     .then((res) => {
  //       console.log(res);
  //       res.json();
  //     })
  //     .then((result) => {
  //       console.log("loggedIn via token: ", result);
  //       // setUser({ token: result.token, loggedIn: true, user: result.user });
  //     })
  //     .catch(
  //       // setUser({ token: "", loggedIn: false, user: {} })
  //     );
  // }



  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Switch>
            <Route path="/login">
              <Login/>
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
    </UserProvider>
  );
};

export default App;
