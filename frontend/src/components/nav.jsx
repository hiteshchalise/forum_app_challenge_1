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
    console.log("props: ", this.props.loginCallback);
    if(!this.state.loggedIn){
      loginBtn = <Link to={{pathname: '/login', state: {

      }}}> <button> Login </button> </Link>;
      registerBtn = <Link to="/register"> <button> Register </button> </Link>
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
