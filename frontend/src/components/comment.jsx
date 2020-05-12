import React from 'react';
import "./style/comment.css";
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import convertToTimeAgo from "../utils/dateConverter";
import { styleMap, blockStyleFn } from "../utils/draftJsCustomStyle"

const Comment = (props) => {

    const convertComment = (raw) => {
        const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(raw)))
        return editorState;
    }


    return (
        <div className="comment">
            <div className="container margin-0 border-0 ">
                <div className="left-section">
                    <div className="btn-up">
                        <button></button>
                    </div>
                    <div className="upvotes">
                        <h5>1</h5>
                    </div>
                    <div className="btn-down">
                        <button></button>
                    </div>
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