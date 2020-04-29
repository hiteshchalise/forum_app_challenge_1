import React from "react";
import "./style/container.css";
import { Link } from "react-router-dom";
import { Editor, EditorState, convertFromRaw } from 'draft-js';

const styleMap = {
  'SUPERSCRIPT': {
    position: "relative",
    top: "-0.5em",
    fontSize: "80%"
  }
}

const blockStyleFn = (contentBlock) => {
  const type = contentBlock.getType();
  if (type === 'blockquote') {
    return 'blockquote';
  } else if (type === 'header') {
    return 'header';
  }
}

const PostContainer = (props) => {

  // const history = useHistory();
  const convertPost = (raw) => {
    const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(raw)))
    return editorState;
  }

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

  return (
    <Link
      to={{ pathname: "/postDetail", state: { post: props.post } }}
      className="post-container-link"
      style={{
        "textDecoration": "none",
        "color": "#141414"
      }}
    >
      <div className="container">
        <div className="left-section">
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
        <div className="right-section">
          <div className="info-section">
            <h2>{props.post.post_title}</h2>
            <small >Posted By: </small>
            <small className="subitem"> {props.post.posted_by}</small>
            <small className="subitem"> {getPostedAt()}</small>
          </div>
          <div className="content-section">
            <Editor
              editorState={convertPost(props.post.post_body)}
              readOnly={true}
              customStyleMap={styleMap}
              blockStyleFn={blockStyleFn}
            />
          </div>
        </div>
      </div>
    </Link>
  );

}

export default PostContainer;
