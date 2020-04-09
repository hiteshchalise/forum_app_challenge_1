import React, { Component } from "react";
import './style/nav.css'
import { Link } from "react-router-dom";

class Nav extends Component {
  constructor(props){
    super(props);

    this.state = {
      loggedIn: props.loggedIn,
      user: props.user
    }
  }
  render() {
    let loginBtn;
    let registerBtn;
    let userName;
    if(!this.state.loggedIn){
      loginBtn = <Link to="/login/:this.props.loginCallback"> Login </Link>;
      registerBtn = <Link to="/register"> Register </Link>
    } else {
      loginBtn = null;
      registerBtn = null;
    userName = <small>Welcome {this.state.user.name}</small>
    }
    return (
      <div id="main-nav">
        <div className="app-name">
          <h1>Forum App</h1>
        </div>
        <div className="nav-btn">
          {loginBtn}
          {registerBtn}
          {userName}
        </div>
      </div>
    );
  }
}

export default Nav;
