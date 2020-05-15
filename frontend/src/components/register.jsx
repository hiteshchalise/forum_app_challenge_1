import React, { useState, useEffect } from "react";
import "./style/auth.css";
import { Link, useHistory } from "react-router-dom";
import { StoreContext } from "../storeContext";
import userCreator from "../store/user";
import { useContext } from "react";
import api from "../utils/api";

const Register = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameIsValid, setUsernameIsValid] = useState(false);
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [confirmPasswordIsValid, setConfirmPasswordIsValid] = useState(false);

  const store = useContext(StoreContext);
  let history = useHistory();

  const user = store.getState();

  useEffect(() => {
    if (user.name !== undefined) {
      history.push("/");
    }
  }, [user, history]);

  const register = (name, email, password) => {
    api("/api/users", {
      method: "POST",
      withCredentials: true,
      data: {
        name: name,
        email: email,
        password: password,
      },
    }).then((result) => {
      const { id, name, email } = result.data.user;
      store.dispatch(userCreator({ id, name, email, token: result.data.token }));
    }).catch((error) => {
      console.log(error);
    });
  };

  const handleSubmit = () => {
    if (
      name === "" ||
      email === "" ||
      password === "" ||
      !usernameIsValid ||
      !emailIsValid ||
      !confirmPasswordIsValid
    ) {
      console.log("invalid form");
    } else {
      console.log("Name: ", name);
      console.log("Email: ", email);
      console.log("Password: ", password);

      register(name, email, password);
    }
  };

  const handleNameChange = (event) => {
    const name = event.target.value;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    setName(name);
    if (name.match(usernameRegex)) {
      setUsernameIsValid(true);
    } else {
      setUsernameIsValid(false);
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
    const password = event.target.value;
    setPassword(password);
    if (confirmPassword === password) {
      setConfirmPasswordIsValid(true);
    } else {
      setConfirmPasswordIsValid(false);
    }
  };

  const handleConfirmPasswordChange = (event) => {
    const confirmPassword = event.target.value;
    setConfirmPassword(confirmPassword);

    if (confirmPassword === password) {
      setConfirmPasswordIsValid(true);
    } else {
      setConfirmPasswordIsValid(false);
    }
  };

  const invalidBorderStyle = {
    borderBottomColor: "red",
    borderBottomWidth: "2px",
  };

  let invalidNameStyle;
  if (!usernameIsValid) {
    invalidNameStyle = invalidBorderStyle;
  } else {
    invalidNameStyle = {};
  }

  let invalidEmailStyle;
  if (emailIsValid === false) {
    invalidEmailStyle = invalidBorderStyle;
  } else {
    invalidEmailStyle = {};
  }

  let invalidPasswordStyle;
  if (password === "") {
    invalidPasswordStyle = invalidBorderStyle;
  } else {
    invalidPasswordStyle = {};
  }

  let invalidConfirmPasswordStyle;
  if (!confirmPasswordIsValid) {
    invalidConfirmPasswordStyle = invalidBorderStyle;
  } else {
    invalidConfirmPasswordStyle = {};
  }

  return (
    <div className="login-register-container">
      <Link to="/login" className="side-container">
        LOGIN
      </Link>
      <div className="main-container">
        <div className="title">Register</div>
        <div className="body">
          <form>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={name}
              onChange={handleNameChange}
              className="input"
              style={invalidNameStyle}
            />
            <br />
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
              style={invalidPasswordStyle}
            />
            <br />
            <input
              type="password"
              name="confirm-password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="input"
              style={invalidConfirmPasswordStyle}
            />
            <br />
            <button type="button" onClick={handleSubmit}>
              Register
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

export default Register;
