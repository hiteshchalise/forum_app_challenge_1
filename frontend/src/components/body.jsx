import React, { useState } from "react";
import PostContainer from "./postContainer";
import { useEffect } from "react";
import api from "../utils/api";
import SideBar from "./sidebar";
import "./style/body.css";

const Body = (props) => {
      const [items, setItems] = useState([]);


  useEffect(()=>{

    api("/api/posts").then((result) => {
      setItems(result.data);
    }).catch((error) => {
      console.log(error);
    });
  }, [])

  let postContainers = [];
  items.forEach((item)=>{
    postContainers.push(<PostContainer post={item} key={item._id} />)
  })
  return (
    <div className="body">
      <div className="posts">{postContainers}</div>
      <div className="sidebar"><SideBar/></div>
    </div>
  );

}

export default Body;
