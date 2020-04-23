import React from "react";
import { useLocation } from "react-router-dom";
import "./style/post-detail.css";
import { useEffect, useState } from "react";
import api from "../utils/api";
import Comment from "./comment";
import AddComment from "./addComment";

const PostDetail = (props) => {
  const data = useLocation();
  const [post, setPost] = useState({
    _id: data.state.post._id,
    post_title: data.state.post.post_title,
    posted_by: data.state.post.posted_by,
    posted_at: data.state.post.posted_at,
    post_body: data.state.post.post_body,
    comments: []
  });

  useEffect(() => {
    api.get(`/api/posts/${post._id}`).then((result) => {
      setPost(result.data);
    }).catch((error) => {
      console.log(error);
    });
    // setPost(cachedDetailPost);
  }, [post._id])

  const getPostedAt = () => {
    const dateNow = new Date(Date.now());
    const postedAtDate = new Date(data.state.post.posted_at);

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

  const comments = [];
  useEffect(() => {
    if (post.comments !== undefined) {
      post.comments.forEach(
        (comment) => {
          comments.push(<Comment comment={comment} key={comment._id} />);
        }
      )
    }
  }, [post, comments]);


  return (
    // <p>Post Detail Page: {data.state.postId}</p>
    <div className="post-detail">
      <div className="container width-70">
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
            <div className="title">
              <h2>{post.post_title}</h2>
            </div>
            <div className="sub-title flex-row">
              <div className="posted-by subitem">
                <small>Posted By: </small>
                <small>{post.posted_by}</small>
              </div>
              <div className="posted-on">
                <small> {getPostedAt()}</small>
              </div>
            </div>
          </div>
          <div className="content-section">
            {post.post_body}
          </div>
          <div className="add-comment">
            <AddComment />
          </div>
          <div className="commentSection">
            {comments.length === 0 ? <div>No Comments</div> : <div>{comments}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

const cachedDetailPost = {
  "_id": 2,
  "post_title": "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
  "post_body": "ChLorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam non tempore quibusdam rerum fuga molestiae et vitae, quas, cupiditate incidunt aut minus doloribus quia praesentium quis vel? Aut, nihil quis.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam non tempore quibusdam rerum fuga molestiae et vitae, quas, cupiditate incidunt aut minus doloribus quia praesentium quis vel? Aut, nihil quis.alise",
  "posted_by": "HiteshChalise",
  "posted_at": 1587346935571,
  "comments": [
    {
      "_id": 1,
      "comment_body": "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit, obcaecati voluptate nisi provident iusto voluptatem hic dolorum. Accusantium, accusamus nobis, tempora saepe architecto autem praesentium, aliquid deserunt odio ab quasi?",
      "commented_by_id": "userId",
      "posted_at": 1587346935571
    },

    {
      "_id": 2,
      "comment_body": "This is comment 2",
      "commented_by_id": "userId",
      "posted_at": 1587346935571
    },
    {
      "_id": 3,
      "comment_body": "This is comment 3",
      "commented_by_id": "userId",
      "posted_at": 1587346935571
    },
    {
      "_id": 4,
      "comment_body": "This is comment 1",
      "commented_by_id": "userId",
      "posted_at": 1587346935571
    },

    {
      "_id": 5,
      "comment_body": "This is comment 2",
      "commented_by_id": "userId",
      "posted_at": 1587346935571
    },
    {
      "_id": 6,
      "comment_body": "This is comment 3",
      "commented_by_id": "userId",
      "posted_at": 1587346935571
    }
  ]
}
export default PostDetail;