import React, { useContext } from "react";
import { StoreContext } from "../storeContext";
import { Link, useHistory } from "react-router-dom";
import MyEditor from "./myEditor";
import 'draft-js/dist/Draft.css';
import api from "../utils/api";


const AddComment = (props) => {

    const store = useContext(StoreContext);
    const user = store.getState();
    const history = useHistory();

    const commentCB = (comment_body) => {
        api.post(`/api/posts/${props.post._id}/comments/`, {
            "comment_body": comment_body,
            "commented_by": user.name
        }, {
            headers: {
                "x-auth-token": user.token,
            }
        }).then((result) => {
            console.log("comment added: " + result.body);

            history.push({ pathname: "/empty" });
            history.replace({ pathname: "/postDetail", state: { post: props.post } })
        }).catch((error) => {
            console.log(error);
        });
    }


    return (
        !user.loggedIn ?
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