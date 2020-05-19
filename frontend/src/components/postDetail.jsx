import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import "./style/post-detail.css";
// import "./style/container.css";
import Comment from "./comment";
import AddComment from "./addComment";
import Upvote from "./upvote";

import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { styleMap, blockStyleFn } from "../utils/draftJsCustomStyle"

import api from "../utils/api";
import convertToTimeAgo from "../utils/dateConverter";

import { updatePostById, addPosts } from "../store/posts";
import { updatePostUpvote } from "../store/user";
import { updatePostUpvoteCount } from "../store/posts";


const PostDetail = () => {
  const data = useLocation();
  const { id } = useParams();
  const post = useSelector(state => state.posts.find(post => post._id === id));
  const user = useSelector(state => state.user);
  const upvotedPosts = useSelector(state => state.user.upvoted_posts);
  const dispatch = useDispatch();

  const convertPost = (raw) => {
    const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(raw)))
    return editorState;
  }

  const handleUpvoteClick = (dir) => {
    api.post("/api/users/upvote", {
      "postId": id,
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
    if (!post) {
      api.get(`/api/posts/${id}`)
        .then((result) => {
          // setPost(result.data);
          console.log("PostDetail: result.data: ", result.data);
          dispatch(updatePostById(result.data));
          dispatch(addPosts([{ ...result.data }]));
        }).catch((error) => {
          console.log(error);
        });
    }
  }, [id, dispatch])

  const upvotedPost = upvotedPosts.find(upvotedPost => upvotedPost.postId === id);
  console.log(upvotedPost);
  return (
    // <p>Post Detail Page: {data.state.postId}</p>
    !post ? <div>Sorry no post available</div> :
      <div className="post-detail">
        <div className="container width-70">
          <div className="left-section">
            <Upvote
              upvoteDir={upvotedPost ? upvotedPost.upvote_dir : 0}
              upvoteCount={post.upvotes}
              handleClick={handleUpvoteClick}
            />
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
                  (comment) => <Comment comment={comment} key={comment._id} postId={id} />
                ) : <div className="">No Comments</div>
              }
            </div>
          </div>
        </div>
      </div>
  )
}

export default PostDetail;