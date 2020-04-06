import React, { Component } from "react";
import "./style/login.css";

class Login extends Component {
    constructor(props){
        super(props);

        this.state = {
            "email": "",
            "password": ""
        }
    }

  handleSubmit = () => {
      console.log("Email: ", this.state.email);
      console.log("Password: ", this.state.password);
  };

  handleEmailChange = (event) => {
      const email = event.target.value;
      this.setState((prevState, props) => {
          return {
              "email": email
          }
      })
  };

  handlePasswordChange = (event) => {
      const password = event.target.value;
      this.setState((prevState, props) => {
          return {
              "password": password
          }
      })
  };

  render() {
    return (
      <div className="login-container">
        <form>
            <label>
                Email:
          <input type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.handleEmailChange} />
            </label>
          <br/>
          <label>
              Password:
               <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}/>
        
          </label>
           <br/>    
          <button type="button" onClick={this.handleSubmit}>Login</button>
        </form>
      </div>
    );
  }
}

export default Login;
