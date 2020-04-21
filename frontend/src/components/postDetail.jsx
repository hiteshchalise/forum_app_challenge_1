import React from "react";
import { useLocation } from "react-router-dom";
import "./style/post-detail.css";
import { useEffect, useState } from "react";
import api from "../utils/api";

const PostDetail = (props) => {
    const data = useLocation();
    const [post, setPost] = useState({
      postId: data.state.post._id,
      post_title: data.state.post.post_title,
      posted_by: data.state.post.posted_by,
      posted_at: data.state.post.posted_at,
      post_body:  data.state.post.post_body
    });

    useEffect(() => {  
        api.get(`/api/posts/${post.postId}`).then((result)=>{
            setPost(result.data);
        }).catch((error)=>{
            console.log(error);
            // setPost(cachedDetailPost);
        });
    }, [data])

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

    return (
        // <p>Post Detail Page: {data.state.postId}</p>
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
            <h2>{post.post_title}</h2>
          </div>

          <div className="sub-title">
            <div className="posted-by">
              <small>Posted By: </small>
              <small>{post.posted_by}</small>
            </div>
            <div className="posted-on">
              <small> {getPostedAt()}</small>
            </div>
          </div>
          <div className="content">
            {post.post_body}
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
    "posted_at": 1587346935571
}
export default PostDetail;