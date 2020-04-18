import React, { useContext } from "react";
import "./style/nav.css";
import { Link } from "react-router-dom";
import { UserContext } from "./../userContext";
import api from "../utils/api";

const Nav = (props) => {
  const [user, setUser] = useContext(UserContext);

  const onLogout = () => {
    api('/api/auth/logout', {method: "POST", withCredentials:true}).then(
      (result) => {
        setUser({ token: "", loggedIn: false, user: "" });
      }
    ).catch(
      (error) => {
        console.error(error); 
        setUser({ token: "", loggedIn: false, user: "" });}
    );
  }

  return (
    <div id="main-nav">
      <div className="app-name">
        <h1>Forum App</h1>
      </div>
      <div className="nav-btn">
        {user.loggedIn ? (
          <div>
            <small>Welcome {user.user.name}  </small>
            <button onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <div className="nav-btn">
            <Link to="/login">
              <button> Login </button>
            </Link>
            <Link to="/register">
              <button> Register </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
