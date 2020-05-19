import React from 'react';
import "./style/comment.css";
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import convertToTimeAgo from "../utils/dateConverter";
import { styleMap, blockStyleFn } from "../utils/draftJsCustomStyle"
import Upvote from "./upvote";
import { useSelector, useDispatch } from 'react-redux';
import api from '../utils/api';
import { updateUpvotedComment } from '../store/user';
import { updateCommentUpvote } from '../store/posts';

const Comment = (props) => {
    const userToken = useSelector(state => state.user.token);
    const upvotedComments = useSelector(state => state.user.upvoted_comments);
    const dispatch = useDispatch();

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
                "x-auth-token": userToken,
            }
        }).then((result) => {
            dispatch(updateUpvotedComment(result.data));
            dispatch(updateCommentUpvote(result.data));
            console.log("Comment Upvoted: ", result.data)
        }).catch((error) => {
            console.log(error);
        });
    }

    console.log(upvotedComments, userToken);
    const upvotedComment = upvotedComments.find(
        upvoted_comment => upvoted_comment.postId === props.postId
    ).comments.find(
        comment => comment.commentId === props.comment._id
    );

    return (
        <div className="comment">
            <div className="container margin-0 border-0 ">
                <div className="left-section">
                    <Upvote
                        upvoteDir={upvotedComment.upvote_dir}
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