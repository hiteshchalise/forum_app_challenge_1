import React, { useContext } from "react";
import "./style/nav.css";
import { Link } from "react-router-dom";
import { UserContext } from "./../userContext";

const Nav = (props) => {
  const [user, ] = useContext(UserContext);
  console.log("User: ", user.user.name)

  let loginBtn;
  let registerBtn;
  let userName;

  if (!user.loggedIn) {
    loginBtn = (
      <Link to="/login">
        <button> Login </button>
      </Link>
    );
    registerBtn = (
      <Link to="/register">
        <button> Register </button>
      </Link>
    );
  } else {
    loginBtn = null;
    registerBtn = null;
    userName = <small>Welcome {user.user.name}</small>;
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
};

export default Nav;
