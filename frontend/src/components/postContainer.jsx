import React from "react";
import "./style/container.css";
import { useHistory } from "react-router-dom";
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import Upvote from "./upvote";

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
  const history = useHistory();

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

  const handlePostClick = () => {
    history.push("/postDetail", { post: props.post })
  }

  return (
    <div className="container">
      <div className="left-section">
        <Upvote post={props.post} />
      </div>
      <div className="right-section" onClick={handlePostClick}>
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
  );

}

export default PostContainer;
