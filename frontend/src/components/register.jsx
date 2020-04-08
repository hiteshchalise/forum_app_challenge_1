import React, { Component } from "react";
import "./style/auth.css";
import { Link } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      emailIsValid: false,
      confirmPasswordIsValid: false,
    };
  }

  handleSubmit = () => {
    if (
      this.state.name === "" ||
      this.state.email === "" ||
      this.state.password === "" ||
      !this.state.emailIsValid ||
      !this.state.confirmPasswordIsValid
    ) {
      console.log("invalid form");
    } else {
        console.log("Name: ", this.state.name);
      console.log("Email: ", this.state.email);
      console.log("Password: ", this.state.password);
    }
  };
  
  handleNameChange = (event) =>{
      const name = event.target.value;
      this.setState((prevState, props)=>{
          return {
              name: name
          }
      });
  }

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

  handleConfirmPasswordChange = (event) => {
    const confirmPassword = event.target.value;
    this.setState((prevState, props) => {
      return {
        confirmPassword: confirmPassword,
      };
    });

    if (confirmPassword === this.state.password) {
      this.setState((prevState, props) => {
        return {
          confirmPasswordIsValid: true,
        };
      });
    } else {
      this.setState((prevState, props) => {
        return {
          confirmPasswordIsValid: false,
        };
      });
    }
  };

  render() {
    const invalidBorderStyle = {
        borderBottomColor: "red",
        borderBottomWidth: "2px",
      };
      let invalidNameStyle;
      if(this.state.name === ""){
          invalidNameStyle = invalidBorderStyle;
      }else{
          invalidNameStyle = {}
      }

    let invalidEmailStyle;
    if (this.state.emailIsValid === false) {
      invalidEmailStyle = invalidBorderStyle
    } else {
      invalidEmailStyle = {};
    }

    let invalidPasswordStyle;
    if(this.state.password === ""){
        invalidPasswordStyle = invalidBorderStyle;
    }else{
        invalidPasswordStyle = {}
    }

    let invalidConfirmPasswordStyle;
    if (!this.state.confirmPasswordIsValid) {
      invalidConfirmPasswordStyle = invalidBorderStyle
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
                value={this.state.name}
                onChange={this.handleNameChange}
                className="input"
                style={invalidNameStyle}
              />
              <br />
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleEmailChange}
                className="input"
                style={invalidEmailStyle}
              />
              <br />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
                className="input"
                style={invalidPasswordStyle}
              />
              <br />
              <input
                type="password"
                name="confirm-password"
                placeholder="Confirm Password"
                value={this.state.confirmPassword}
                onChange={this.handleConfirmPasswordChange}
                className="input"
                style={invalidConfirmPasswordStyle}
              />
              <br />
              <button type="button" onClick={this.handleSubmit}>
                Register
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

export default Register;
