import React from "react";
import "./style/nav.css";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { userDestroyer } from "../store/auth";
import { useSelector, useDispatch } from "react-redux";

const Nav = (props) => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const onLogout = () => {
    api('/api/auth/logout', { method: "POST", withCredentials: true }).then(
      (result) => {
        dispatch(userDestroyer());
      }
    ).catch(
      (error) => {
        console.error(error);
        dispatch(userDestroyer());
      }
    );
  }

  return (
    <div id="main-nav">
      <div className="app-name">
        <h1>Forum App</h1>
      </div>
      <div className="nav-btn">
        {user.name !== undefined ? (
          <div>
            <small>Welcome {user.name}  </small>
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
