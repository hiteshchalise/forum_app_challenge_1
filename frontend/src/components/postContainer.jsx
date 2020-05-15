import React from "react";
import "./style/container.css";
import { useHistory } from "react-router-dom";
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import Upvote from "./upvote";
import convertToTimeAgo from "../utils/dateConverter";
import { styleMap, blockStyleFn } from "../utils/draftJsCustomStyle"
import { useSelector } from "react-redux";

const PostContainer = (props) => {
  const history = useHistory();
  const upvotedPosts = useSelector(state => state.user.upvoted_posts);

  const convertPost = (raw) => {
    const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(raw)))
    return editorState;
  }

  const handlePostClick = () => {
    history.push("/postDetail", { post: props.post })
  }

  const upvotedPost = upvotedPosts.find(post => post.postId === props.post._id);

  return (
    <div className="container">
      <div className="left-section">
        {/* <Upvote post={props.post} /> */}
        <Upvote
          upvoteDir={upvotedPost ? upvotedPost.upvote_dir : 0}
          upvoteCount={props.post.upvotes}
          postId={props.post._id} />
      </div>
      <div className="right-section" onClick={handlePostClick}>
        <div className="info-section">
          <h2>{props.post.post_title}</h2>
          <small >Posted By: </small>
          <small className="subitem"> {props.post.posted_by}</small>
          <small className="subitem"> {convertToTimeAgo(props.post.posted_at)}</small>
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
