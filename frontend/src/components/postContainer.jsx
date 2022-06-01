import React from "react";
import "./style/container.css";
import { useHistory } from "react-router-dom";
import Upvote from "./upvote";

import { updatePostUpvote } from "../store/user/upvotedPosts";
import { updatePostUpvoteCount } from "../store/posts";

import { Editor, EditorState, convertFromRaw } from 'draft-js';
import convertToTimeAgo from "../utils/dateConverter";
import { styleMap, blockStyleFn } from "../utils/draftJsCustomStyle"
import api from "../utils/api";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { isEmpty } from "underscore";

const convertPost = (raw) => {
  const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(raw)))
  return editorState;
}

const PostContainer = (props) => {
  const history = useHistory();
  const upvotedPosts = useSelector(state => state.user.upvotedPosts);
  const upvotes = useSelector(state => state.posts.find(post => post._id === props.post._id).upvotes);
  const user = useSelector(state => state.user.auth);
  const dispatch = useDispatch();

  const [upvotedPost, setUpvotedPost] = useState();

  const handlePostClick = () => {
    history.push(`/post/${props.post._id}`, { post: props.post })
  }

  const handleUpvoteClick = (dir) => {
    api.post("/api/users/upvote", {
      "postId": props.post._id,
      "dir": dir
    }, {
      headers: {
        "x-auth-token": user.token,
      }
    }).then((result) => {
      dispatch(updatePostUpvote(result.data));
      dispatch(updatePostUpvoteCount(result.data));
    }).catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    if (!isEmpty(user)) {
      setUpvotedPost(upvotedPosts.find(post => post.postId === props.post._id));
    }
  }, [user, upvotedPosts, props.post._id])


  return (
    <div className="container">
      <div className="left-section">
        {/* <Upvote post={props.post} /> */}
        <Upvote
          upvoteDir={upvotedPost ? upvotedPost.upvote_dir : 0}
          upvoteCount={upvotes}
          handleClick={handleUpvoteClick}
        />
      </div>
      <div className="right-section" onClick={handlePostClick}>
        <div className="info-section">
          <h2>{props.post.post_title}</h2>
          <small >Posted By: </small>
          <small className="subitem"> {props.post.posted_by}</small>
          <small className="subitem"> {convertToTimeAgo(props.post.posted_at)}</small>
        </div>
        <div className="content-section">
          <p> Comment </p>
        </div>
      </div>
    </div>
  );

}

export default PostContainer;
