import React, { useState } from "react";
import "./style/auth.css";
import { Link, useHistory } from "react-router-dom";
import userCreator from "../store/user";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

const Login = (props) => {

  let history = useHistory();
  const user = useSelector(state => state.user, shallowEqual);
  const dispatch = useDispatch();

  if (user.name !== undefined) {
    history.push("/");
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [invalidForm, setInvalidFormState] = useState(false);

  const login = (email, password) => {
    fetch("http://localhost:5000/api/auth/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        const { id, name, email, upvoted_posts } = result.user;
        dispatch(userCreator({ id, name, email, token: result.token, upvoted_posts }));
      })
      .catch((error) => {
        // setUser({ user: {}, loggedIn: false, token: {} });
      });
  };

  const handleSubmit = () => {
    if (email === "" || password === "" || !emailIsValid) {
      console.log("invalid form");
      setInvalidFormState(true);
    } else {
      login(email, password);
    }
  };

  const handleEmailChange = (event) => {
    const email = event.target.value;
    setEmail(email);
    if (validateEmail(email)) {
      setEmailIsValid(true);
    } else {
      setEmailIsValid(false);
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  let invalidEmailStyle;
  if (emailIsValid === false) {
    invalidEmailStyle = {
      borderBottomColor: "red",
      borderBottomWidth: "2px",
    };
  } else {
    invalidEmailStyle = {};
  }

  let invalidFormStyle;
  if (invalidForm || password === "") {
    invalidFormStyle = {
      borderBottomColor: "red",
      borderBottomWidth: "2px",
    };
  } else {
    invalidFormStyle = {};
  }

  return (
    <div className="login-register-container">
      <Link to="/register" className="side-container">
        REGISTER
      </Link>
      <div className="main-container">
        <div className="title">Login</div>
        <div className="body">
          <form>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className="input"
              style={invalidEmailStyle}
            />
            <br />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="input"
              style={invalidFormStyle}
            />
            <br />
            <button type="button" onClick={handleSubmit}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

function validateEmail(email) {
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
}

export default Login;
