import React, { useState } from "react";
import "./style/create-post.css";
import api from "../utils/api";
import { useHistory } from "react-router-dom";
import MyEditor from "./myEditor";
import 'draft-js/dist/Draft.css';
import { useSelector, useDispatch } from "react-redux";
import { addUpvotedPost } from "../store/user/upvotedPosts";


const CreatePost = (props) => {
    const [title, setTitle] = useState("");

    const user = useSelector(state => state.user.auth);
    const dispatch = useDispatch();

    let history = useHistory();

    const onTitleChange = (event) => {
        setTitle(event.target.value);
    }

    const handleSubmit = (body) => {
        console.log(user.token);
        api.post("/api/posts/", {
            "post_title": title,
            "post_body": body
        }, {
            headers: {
                "x-auth-token": user.token,
            }
        }).then((result) => {
            console.log("post added: ", result);
            dispatch(addUpvotedPost(result.data))
            history.push("/");

        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className="create-post">
            <div className="create-post-banner"><h1>CreatePost</h1></div>
            <div className="title-input"><input onChange={onTitleChange} placeholder="Title of post" /> </div>
            {/* <div className="body-input"><textarea name="postBody" id="createPostBody" cols="30" rows="10" placeholder="Body of post" onChange={onBodyChange}></textarea></div> */}

            <MyEditor className="rounded-container" submitCB={handleSubmit} />
            {/* <div className="submit"><button onClick={handleSubmit}>submit</button></div> */}
        </div>
    )
}

export default CreatePost;