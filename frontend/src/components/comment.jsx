import React from 'react';
import "./style/comment.css";
import { Editor, EditorState, convertFromRaw } from 'draft-js';

const styleMap = {
    'SUPERSCRIPT': {
        position: "relative",
        top: "-0.5em",
        fontSize: "80%"
    }
}

const blockStyleFn = (contentBlock) => {
    const type = contentBlock.getType();
    if (type === 'blockquote') {
        return 'blockquote';
    } else if (type === 'header') {
        return 'header';
    }
}

const Comment = (props) => {


    const getPostedAt = (posted_at) => {
        const dateNow = new Date(Date.now());
        const postedAtDate = new Date(posted_at);

        let postedAt = "";
        const timeDifference = dateNow.getTime() - postedAtDate.getTime();
        if (timeDifference < 1000 * 60) {
            postedAt = Math.round(timeDifference / 1000) + " Seconds Ago";
        } else if (timeDifference < 1000 * 60 * 60) {
            postedAt = Math.round(timeDifference / 60000) + " Minutes Ago";
        } else if (timeDifference < 1000 * 60 * 60 * 24) {
            postedAt = Math.round(timeDifference / 3600000) + " Hours Ago";
        } else if (timeDifference < 1000 * 60 * 60 * 24 * 365) {
            postedAt = Math.round(timeDifference / (1000 * 60 * 60 * 24)) + " Days Ago";
        }

        return postedAt;
    }
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
                        <small> {getPostedAt(props.comment.commented_at)}</small>
                    </div>
                    <div className="content-section">
                        {/* {console.log(convertFromRaw(JSON.parse(props.comment.comment_body)))}
                        {stateToHTML(convertFromRaw(JSON.parse(props.comment.comment_body)))} */}

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