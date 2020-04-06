import React from "react";
import Nav from "./components/nav";
import Body from "./components/body";
import Login from "./components/login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Nav />
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/">
              <Body />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
