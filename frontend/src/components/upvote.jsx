import React, { useState, useContext, useEffect } from "react";
import "./style/container.css";
import { UserContext } from "../userContext";
import api from "../utils/api";

const Upvote = (props) => {
    const [upvoteDir, setUpvoteDir] = useState(0);
    const [upvoteCount, setUpvoteCount] = useState(props.post.upvotes);
    const [user] = useContext(UserContext);

    useEffect(() => {
        if (user.loggedIn) {
            const upvotedPost = user.user.upvoted_posts.find((upvoted_post) => {
                return props.post._id === upvoted_post.postId;
            })
            if (upvotedPost === undefined) {
                setUpvoteDir(0);
            } else {
                setUpvoteDir(upvotedPost.upvote_dir);
            }
        }
    }, [user, setUpvoteDir, props.post._id])

    const handleUpClick = () => {
        api.post("/api/users/upvote", {
            "postId": props.post._id,
            "dir": 1
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

    const handleDownClick = () => {
        api.post("/api/users/upvote", {
            "postId": props.post._id,
            "dir": -1
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
            <div className="btn-up" onClick={handleUpClick}>
                {upvoteDir === 1 ?
                    <div className="active"><button></button></div> :
                    <div className="inactive"><button></button></div>
                }
            </div>
            <div className="upvotes">
                <h5>{upvoteCount}</h5>
            </div>
            <div className="btn-down" onClick={handleDownClick}>
                {upvoteDir === -1 ?
                    <div className="active"><button></button></div> :
                    <div className="inactive"><button></button></div>
                }
            </div>
        </div>
    )
}

export default Upvote;