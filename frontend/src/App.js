import React from "react";
import Cookies from "js-cookie";
import Nav from "./components/nav";
import Body from "./components/body";
import Login from "./components/login";
import Register from "./components/register";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      loggedIn: false,
      user: {},
    };

    this.loginCallback = this.loginCallback.bind(this); 
  }

  componentDidMount() {
    if (this.state.token === "" && Cookies.get("refreshToken")) {
      fetch("http://localhost:5000/api/auth/refresh")
        .then((res) => {
          console.log(res);
          res.json();
        })
        .then((result) => {
          console.log("loggedIn via refresh");
          const token = result.token;
          this.setState((prevState, props) => {
            return {
              token: token,
              loggedIn: true,
              user: result.user,
            };
          });
        })
        .catch(
          this.setState((prevState, props) => {
            return {
              token: "",
              loggedIn: false,
              user: {},
            };
          })
        );
    }
  }

  loginCallback(email, password) {
    fetch("http://localhost:5000/api/auth/", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then((result) =>{
        console.log("loggedIn via email password: ", result);
        this.setState((prevState, props) => {
          return {
            token: result.token,
            loggedIn: true,
            user: result.user,
          };
        })}
      )
      .catch(
        this.setState((prevState, props) => {
          return {
            token: "",
            loggedIn: false,
            user: {},
          };
        })
      );
  }

  render() {
    const loggedIn = this.state.loggedIn;
    const user = this.state.user;
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/login">
              <Login  loginCallback={this.loginCallback}/>
            </Route>
            <Route path="/register" >
              <Register />
            </Route>
            <Route path="/">
              <Nav loggedIn={loggedIn} user={user} />
              <Body loggedIn={loggedIn} user={user} />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
