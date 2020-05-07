import React, { useState, useContext } from "react";
import "./style/auth.css";
import { Link, useHistory } from "react-router-dom";
import userCreator from "../store/auth";
import { StoreContext } from "../storeContext";
import { useEffect } from "react";

const Login = (props) => {
  const store = useContext(StoreContext);
  let history = useHistory();

  const user = store.getState();

  useEffect(() => {
    if (user.name !== undefined) {
      history.push("/");
    }
  }, [user, history])

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
        console.log("result after successful login: ", result);
        // setUser({ user: result.user, loggedIn: true, token: result.token });
        const { id, name, email } = result.user;
        console.log("UserState successful user dispatch: ", store.getState());
        store.dispatch(userCreator({ id, name, email, token: result.token }));
        console.log("userState after successful user dispatch: ", store.getState());
        history.push("/");
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
