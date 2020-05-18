import React from 'react';
import "./style/comment.css";
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import convertToTimeAgo from "../utils/dateConverter";
import { styleMap, blockStyleFn } from "../utils/draftJsCustomStyle"
import Upvote from "./upvote";
import { useSelector } from 'react-redux';
import api from '../utils/api';

const Comment = (props) => {
    const user = useSelector(state => state.user);

    const convertComment = (raw) => {
        const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(raw)))
        return editorState;
    }


    const handleUpvoteClick = (dir) => {
        api.post("/api/users/upvote/comment", {
            "postId": props.postId,
            "commentId": props.comment._id,
            "dir": dir
        }, {
            headers: {
                "x-auth-token": user.token,
            }
        }).then((result) => {
            // dispatch(updatePostUpvote(result.data));
            // dispatch(updatePostUpvoteCount(result.data));
            console.log("Comment Upvoted: ", result.data)
        }).catch((error) => {
            console.log(error);
        });
    }

    // const upvotedPost = upvotedPosts.find(upvotedPost => upvotedPost.postId === id);

    return (
        <div className="comment">
            <div className="container margin-0 border-0 ">
                <div className="left-section">
                    <Upvote
                        upvoteDir={0}
                        upvoteCount={1}
                        handleClick={handleUpvoteClick}
                    />
                </div>
                <div className="right-section">
                    <div className="info-section">
                        <small className="subitem">{props.comment.commented_by}</small>
                        <small> {convertToTimeAgo(props.comment.commented_at)}</small>
                    </div>
                    <div className="content-section">
                        <Editor
                            editorState={convertComment(props.comment.comment_body)}
                            readOnly={true}
                            customStyleMap={styleMap}
                            blockStyleFn={blockStyleFn}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Comment;