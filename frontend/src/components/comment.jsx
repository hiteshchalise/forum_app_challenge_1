import React from 'react';
import "./style/comment.css";
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import convertToTimeAgo from "../utils/dateConverter";
import { styleMap, blockStyleFn } from "../utils/draftJsCustomStyle"
import Upvote from "./upvote";
import { useSelector, useDispatch } from 'react-redux';
import api from '../utils/api';
import { updateUpvotedComment, addUpvotedCommentsComment, addUpvotedComment } from '../store/user/upvotedComments';
import { updateCommentUpvote } from '../store/posts';
import { useState } from 'react';
import { useEffect } from 'react';
import { isEmpty } from "underscore";

const Comment = (props) => {
    const user = useSelector(state => state.user.auth);
    const upvotedComments = useSelector(state => state.user.upvotedComments);
    const dispatch = useDispatch();

    const [upvotedComment, setUpvotedComment] = useState();

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
            const upvotedComment = upvotedComments.find(comment => comment.postId === result.data.postId);
            if (upvotedComment !== undefined) {
                const comment = upvotedComment.comments.find(comment => comment.commentId === result.data.commentId);
                if (comment !== undefined) {
                    dispatch(updateUpvotedComment(result.data));
                } else {
                    dispatch(addUpvotedCommentsComment(result.data));
                }
            } else {
                dispatch(addUpvotedComment(result.data));
            }
            dispatch(updateCommentUpvote(result.data));
            console.log("Comment Upvoted: ", result.data)
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        if (!isEmpty(user) && upvotedComments !== undefined) {
            const upvotedComment = upvotedComments.find(
                upvoted_comment => upvoted_comment.postId === props.postId
            );
            if (upvotedComment !== undefined) {
                console.log("UpvotedComment: ", upvotedComment);
                const comment = upvotedComment.comments.find(
                    comment => comment.commentId === props.comment._id
                );
                setUpvotedComment(comment);
            }
        }
    }, [user, upvotedComments, props.postId, props.comment._id]);

    return (
        <div className="comment">
            <div className="container margin-0 border-0 ">
                <div className="left-section">
                    <Upvote
                        upvoteDir={upvotedComment ? upvotedComment.upvote_dir : 0}
                        upvoteCount={props.comment.upvotes}
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