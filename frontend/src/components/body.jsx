import React, { Component } from "react";

class Body extends Component {
  render() {
    return (
      <div className="container">
        <div className="left-buttons">
            <button className="btn-up"></button>
            <button className="btn-down"></button>
        </div>
        <div className="right-content">
          <h2>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</h2>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga,
            reiciendis incidunt perferendis sapiente eligendi dolor, ex illo
            eveniet temporibus dignissimos molestiae totam, accusamus dolorem
            tempore consectetur vitae obcaecati. Neque, at!
          </p>
        </div>
      </div>
    );
  }
}

export default Body;
