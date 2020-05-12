import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./style/post-detail.css";
import Comment from "./comment";
import AddComment from "./addComment";
import Upvote from "./upvote";

import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { styleMap, blockStyleFn } from "../utils/draftJsCustomStyle"

import api from "../utils/api";
import convertToTimeAgo from "../utils/dateConverter";


const PostDetail = (props) => {
  const data = useLocation();
  const [post, setPost] = useState({
    _id: data.state.post._id,
    post_title: data.state.post.post_title,
    posted_by: data.state.post.posted_by,
    posted_at: data.state.post.posted_at,
    post_body: data.state.post.post_body,
    comments: [],
    upvotes: data.state.post.upvotes
  });

  const convertPost = (raw) => {
    const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(raw)))
    return editorState;
  }

  useEffect(() => {
    api.get(`/api/posts/${post._id}`)
      .then((result) => {
        setPost(result.data);
      }).catch((error) => {
        console.log(error);
      });
    // setPost(cachedDetailPost);
  }, [post._id])

  return (
    // <p>Post Detail Page: {data.state.postId}</p>
    <div className="post-detail">
      <div className="container width-70">
        <div className="left-section">
          <Upvote post={post} />
        </div>
        <div className="right-section">
          <div className="info-section">
            <div className="title">
              <h2>{post.post_title}</h2>
            </div>
            <div className="sub-title flex-row">
              <div className="posted-by subitem">
                <small>Posted By: </small>
                <small>{post.posted_by}</small>
              </div>
              <div className="posted-on">
                <small> {convertToTimeAgo(data.state.post.posted_at)}</small>
              </div>
            </div>
          </div>
          <div className="content-section">
            <Editor
              editorState={convertPost(post.post_body)}
              readOnly={true}
              customStyleMap={styleMap}
              blockStyleFn={blockStyleFn}
            />
          </div>
          <div className="add-comment">
            <AddComment post={post} />
          </div>
          <div className="commentSection">
            {/* {comments.length === 0 ? <div>No Comments ...</div> : <div>{comments}</div>}
            {comments} */}
            {post.comments !== undefined ?
              post.comments.map(
                (comment) => <Comment comment={comment} key={comment._id} />
              ) : <div className="">No Comments</div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail;