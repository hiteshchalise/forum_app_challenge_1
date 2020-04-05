import React, { Component } from "react";
import "./style/post-container.css";

class PostContainer extends Component {
  constructor(props) {
    super(props);

  }
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
            <h2>{this.props.post.post_title}</h2>
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
            <p>{this.props.post.post_body}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default PostContainer;
