import React, { useState } from "react";
import PostContainer from "./postContainer";
import { useEffect } from "react";
import api from "../utils/api";
import SideBar from "./sidebar";
import "./style/body.css";

const Body = (props) => {
  const [items, setItems] = useState([]);

  useEffect(() => {

    // api("/api/posts").then((result) => {
    //   setItems(result.data);
    // }).catch((error) => {
    //   console.log(error);
    // });
    // when internet is down, this is for development purpose
    setItems(cachedPost);
  }, [])

  let postContainers = [];
  items.forEach((item) => {
    postContainers.push(<PostContainer post={item} key={item._id} />)
  })
  return (
    <div className="body">
      <div className="posts">{postContainers}</div>
      <div className="sidebar"><SideBar /></div>
    </div>
  );

}

const cachedPost = [
  {
    "_id": 1,
    "post_title": "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
    "post_body": "ChLorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam non tempore quibusdam rerum fuga molestiae et vitae, quas, cupiditate incidunt aut minus doloribus quia praesentium quis vel? Aut, nihil quis.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam non tempore quibusdam rerum fuga molestiae et vitae, quas, cupiditate incidunt aut minus doloribus quia praesentium quis vel? Aut, nihil quis.alise. ChLorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam non tempore quibusdam rerum fuga molestiae et vitae, quas, cupiditate incidunt aut minus doloribus quia praesentium quis vel? Aut, nihil quis.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam non tempore quibusdam rerum fuga molestiae et vitae, quas, cupiditate incidunt aut minus doloribus quia praesentium quis vel? Aut, nihil quis.alise. ChLorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam non tempore quibusdam rerum fuga molestiae et vitae, quas, cupiditate incidunt aut minus doloribus quia praesentium quis vel? Aut, nihil quis.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam non tempore quibusdam rerum fuga molestiae et vitae, quas, cupiditate incidunt aut minus doloribus quia praesentium quis vel? Aut, nihil quis.alise. ChLorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam non tempore quibusdam rerum fuga molestiae et vitae, quas, cupiditate incidunt aut minus doloribus quia praesentium quis vel? Aut, nihil quis.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam non tempore quibusdam rerum fuga molestiae et vitae, quas, cupiditate incidunt aut minus doloribus quia praesentium quis vel? Aut, nihil quis.alise",
    "posted_by": "HiteshChalise",
    "posted_at": 1587346935571
  },
  {
    "_id": 2,
    "post_title": "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
    "post_body": "ChLorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam non tempore quibusdam rerum fuga molestiae et vitae, quas, cupiditate incidunt aut minus doloribus quia praesentium quis vel? Aut, nihil quis.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam non tempore quibusdam rerum fuga molestiae et vitae, quas, cupiditate incidunt aut minus doloribus quia praesentium quis vel? Aut, nihil quis.alise",
    "posted_by": "HiteshChalise",
    "posted_at": 1587346935571
  },
  {
    "_id": 3,
    "post_title": "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
    "post_body": "ChLorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam non tempore quibusdam rerum fuga molestiae et vitae, quas, cupiditate incidunt aut minus doloribus quia praesentium quis vel? Aut, nihil quis.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam non tempore quibusdam rerum fuga molestiae et vitae, quas, cupiditate incidunt aut minus doloribus quia praesentium quis vel? Aut, nihil quis.alise",
    "posted_by": "HiteshChalise",
    "posted_at": 1587346935571
  }
];

export default Body;
