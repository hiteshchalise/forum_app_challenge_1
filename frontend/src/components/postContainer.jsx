import React, { Component } from "react";
import "./style/post-container.css";

class PostContainer extends Component {

  getPostedAt() {
    const dateNow = new Date(Date.now());
    const postedAtDate = new Date(this.props.post.posted_at);

    let postedAt = "";
    const timeDifference = dateNow.getTime() - postedAtDate.getTime() ;
    if (timeDifference < 1000 * 60) {
      postedAt = Math.round(timeDifference / 1000) + " Seconds Ago";
    } else if (timeDifference < 1000 * 60 * 60){
      postedAt = Math.round(timeDifference / 60000) + " Minutes Ago";
    } else if (timeDifference < 1000 * 60 * 60 * 24){
      postedAt = Math.round(timeDifference / 3600000) + " Hours Ago";
    } else if (timeDifference < 1000 * 60 * 60 * 24 * 365){
      postedAt =  Math.round(timeDifference / (1000 * 60 * 60 * 24)) + " Days Ago";
    }

    console.log(postedAt);
    return postedAt;
  }

  render() {
    return (
      <div className="post-container">
        <div className="left-buttons">
          <div className="btn-up">
            <button></button>
          </div>
          <div className="upvotes">
            <h5>1</h5>
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
              <small> {this.props.post.posted_by}</small>
            </div>
            <div className="posted-on">
              <small> {this.getPostedAt()}</small>
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
