import React from "react";
import "./style/container.css";
import api from "../utils/api";
import { useSelector, useDispatch } from "react-redux";
import { updatePostUpvote } from "../store/user";
import { updatePostUpvoteCount } from "../store/posts";

const Upvote = ({ upvoteDir, upvoteCount, postId }) => {
    const user = useSelector(state => state.user);
    const upvotes = useSelector(state => state.posts.find(post => post._id === postId).upvotes);
    const dispatch = useDispatch();

    const handleClick = (dir) => {
        api.post("/api/users/upvote", {
            "postId": postId,
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

    return (
        <div className="">
            <div className="btn-up" onClick={() => handleClick(1)}>
                {upvoteDir === 1 ?
                    <div className="active"><button></button></div> :
                    <div className="inactive"><button></button></div>
                }
            </div>
            <div className="upvotes">
                <h5>{upvotes}</h5>
            </div>
            <div className="btn-down" onClick={() => handleClick(-1)}>
                {upvoteDir === -1 ?
                    <div className="active"><button></button></div> :
                    <div className="inactive"><button></button></div>
                }
            </div>
        </div>
    )
}

export default Upvote;