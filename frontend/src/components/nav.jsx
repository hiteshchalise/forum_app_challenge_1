import React, { Component } from "react";
import './style/nav.css'

class Nav extends Component {
  render() {
    return (
      <div id="main-nav">
        <div className="app-name">
          <h1>Forum App</h1>
        </div>
        <div className="nav-btn">
          <button>Login</button>
          <button>Register</button>
        </div>
      </div>
    );
  }
}

export default Nav;
