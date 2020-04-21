import React from "react";
import "./style/post-container.css";
import { Link } from "react-router-dom";

const PostContainer = (props) => {

  // const history = useHistory();

  const getPostedAt = () => {
    const dateNow = new Date(Date.now());
    const postedAtDate = new Date(props.post.posted_at);

    let postedAt = "";
    const timeDifference = dateNow.getTime() - postedAtDate.getTime();
    if (timeDifference < 1000 * 60) {
      postedAt = Math.round(timeDifference / 1000) + " Seconds Ago";
    } else if (timeDifference < 1000 * 60 * 60) {
      postedAt = Math.round(timeDifference / 60000) + " Minutes Ago";
    } else if (timeDifference < 1000 * 60 * 60 * 24) {
      postedAt = Math.round(timeDifference / 3600000) + " Hours Ago";
    } else if (timeDifference < 1000 * 60 * 60 * 24 * 365) {
      postedAt = Math.round(timeDifference / (1000 * 60 * 60 * 24)) + " Days Ago";
    }

    return postedAt;
  }

  const getPostPreview = () => {
    const post = props.post.post_body;

    if (props.post.post_body.length > 750) {
      return <div><p>{props.post.post_body.substr(0, 750)}</p><h4>{"Continue..."}</h4></div>;
    }
    return <div><p>{post}</p></div>;
  }

  // const handlePostClick = () =>{
  //   console.log("Post Clicked: " + props.post._id);
  //   history.push("/")
  // }

  return (
    <Link to={{pathname: "/postDetail", state: {post: props.post}}} className="post-container-link">
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
            <h2>{props.post.post_title}</h2>
          </div>

          <div className="sub-title">
            <div className="posted-by">
              <small>Posted By: </small>
              <small> {props.post.posted_by}</small>
            </div>
            <div className="posted-on">
              <small> {getPostedAt()}</small>
            </div>
          </div>
          <div className="content">
            {getPostPreview()}
          </div>
        </div>
      </div>
    </Link>
  );

}

export default PostContainer;
