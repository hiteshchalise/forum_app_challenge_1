import React, { useEffect } from "react";
import PostContainer from "./postContainer";
import api from "../utils/api";
import SideBar from "./sidebar";
import "./style/body.css";
import { useSelector, useDispatch } from "react-redux";
import { addPosts } from "../store/posts";

const Body = (props) => {
  const posts = useSelector(state => state.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    api("/api/posts").then((result) => {
      console.log("body: result.data: ", result.data);
      dispatch(addPosts(result.data));
    }).catch((error) => {
      console.log(error);
    });
  }, [dispatch])

  let postContainers = [];
  posts.forEach((item) => {
    postContainers.push(<PostContainer post={item} key={item._id} />)
  })
  return (
    <div className="body">
      <div className="posts">{postContainers}</div>
      <div className="sidebar"><SideBar /></div>
    </div>
  );

}

export default Body;
