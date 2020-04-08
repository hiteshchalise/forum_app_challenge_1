import React, { Component } from "react";
import "./style/login.css";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      emailIsValid: false,
      invalidForm: false,
    };
  }

  handleSubmit = () => {
    if (
      this.state.email === "" ||
      this.state.password === "" ||
      !this.state.emailIsValid
    ) {
      console.log("invalid form");
      this.setState((prevState, props) => {
        return {
          invalidForm: true,
        };
      });
    } else {
      this.setState((prevState, props) => {
        return {
          invalidForm: false,
        };
      });
      console.log("Email: ", this.state.email);
      console.log("Password: ", this.state.password);
    }
  };

  handleEmailChange = (event) => {
    const email = event.target.value;
    this.setState((prevState, props) => {
      return {
        email: email,
      };
    });
    if (validateEmail(email)) {
      this.setState((prevState, props) => {
        return {
          emailIsValid: true,
        };
      });
    } else {
      this.setState((prevState, props) => {
        return {
          emailIsValid: false,
        };
      });
    }
  };

  handlePasswordChange = (event) => {
    const password = event.target.value;
    this.setState((prevState, props) => {
      return {
        password: password,
      };
    });
  };

  handleRegister = (event) =>{
    console.log("registration clicked");
  }

  render() {
    let invalidEmailStyle;
    if (this.state.emailIsValid === false) {
      invalidEmailStyle = {
        borderBottomColor: "red",
        borderBottomWidth: "2px",
      };
    } else {
      invalidEmailStyle = {};
    }

    let invalidFormStyle;
    if (this.state.invalidForm || this.state.password === "") {
      invalidFormStyle = {
        borderBottomColor: "red",
        borderBottomWidth: "2px",
      };
    } else {
      invalidFormStyle = {};
    }
    return (
      <div className="login-register-container">
        <div className="register-container" onClick={this.handleRegister}>
          REGISTER
        </div>
        <div className="login-container">
          <div className="login-title">Login</div>
          <div className="login-body">
            <form>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleEmailChange}
                className="login-input"
                style={invalidEmailStyle}
              />
              <br />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
                className="login-input"
                style={invalidFormStyle}
              />
              <br />
              <button type="button" onClick={this.handleSubmit}>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

function validateEmail(email) {
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
}

export default Login;
