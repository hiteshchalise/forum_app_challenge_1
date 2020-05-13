import React, { useState, useEffect } from "react";
import "./style/container.css";
import api from "../utils/api";
import { useSelector } from "react-redux";

const Upvote = (props) => {
    const [upvoteDir, setUpvoteDir] = useState(0);
    const [upvoteCount, setUpvoteCount] = useState(props.post.upvotes);

    // const user = store.getState();
    const user = useSelector(state => state.user);
    useEffect(() => {
        if (user.name !== undefined && user.upvoted_posts !== undefined) {
            const upvotedPost = user.upvoted_posts.find((upvoted_post) => {
                return props.post._id === upvoted_post.postId;
            })
            upvotedPost === undefined ? setUpvoteDir(0) : setUpvoteDir(upvotedPost.upvote_dir);
        }
    }, [user, setUpvoteDir, props.post._id])

    const handleClick = (dir) => {
        api.post("/api/users/upvote", {
            "postId": props.post._id,
            "dir": dir
        }, {
            headers: {
                "x-auth-token": user.token,
            }
        }).then((result) => {
            setUpvoteDir(result.data.dir)
            setUpvoteCount(result.data.upvotes)
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
                <h5>{upvoteCount}</h5>
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