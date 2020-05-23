import React from "react";
import { Link } from "react-router-dom";
import MyEditor from "./myEditor";
import 'draft-js/dist/Draft.css';
import api from "../utils/api";
import { useSelector, useDispatch } from "react-redux";
import { updatePostById } from "../store/posts";


const AddComment = (props) => {
    const user = useSelector(state => state.user.auth);
    const dispatch = useDispatch();

    const commentCB = (comment_body, clearEditor) => {
        api.post(`/api/posts/${props.post._id}/comments/`, {
            "comment_body": comment_body,
            "commented_by": user.name
        }, {
            headers: {
                "x-auth-token": user.token,
            }
        }).then((result) => {
            console.log("comment added: ", result.data);
            dispatch(updatePostById(result.data));
            clearEditor();
        }).catch((error) => {
            console.log(error);
            return false;
        });
    }


    return (
        user.name === undefined ?
            <div className="rounded-container flex-row" style={{ justifyContent: "space-between" }}>
                <p> You need to be logged in to comment</p>
                <div>
                    <Link className="button" style={{ marginRight: "4px" }} to="/register">Sign Up</Link>
                    <Link className="button" to="/login">Login</Link>
                </div>
            </div> :
            <div>
                <small> Comment as: {user.name}</small>
                <MyEditor className="rounded-container" submitCB={commentCB} />
            </div>
    )
}

export default AddComment;