import React, { Component } from "react";
import './style/post-container.css';

class PostContainer extends Component {
  render() {
    return (
      <div className="container">
        <div className="left-buttons">
          <div className="btn-up">
            <button></button>
          </div>
          <div className="upvotes">
            <h5>100K</h5>
          </div>
          <div className="btn-down">
            <button></button>
          </div>
        </div>
        <div className="right-content">
          <div className="title">
            <h2>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</h2>
          </div>

          <div className="sub-title">
            <div className="posted-by">
              <small>Posted By: </small>
              <small> Hitesh Chalise</small>
            </div>
            <div className="posted-on">
              <small> 2 hours ago</small>
            </div>
          </div>
          <div className="content">
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga,
              reiciendis incidunt perferendis sapiente eligendi dolor, ex illo
              eveniet temporibus dignissimos molestiae totam, accusamus dolorem
              tempore consectetur vitae obcaecati. Neque, at!
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default PostContainer;
