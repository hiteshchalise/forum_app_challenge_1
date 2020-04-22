import React from 'react';
import "./style/comment.css";

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


    return (
        // <div className="comment_body">
        //     <div className="comment_head"></div>
        //     .comment_
        //     <p>{props.comment.comment_body}</p>
        // </div>
        <div className="comment">
            <div className="container margin-0">
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
                        <small className="subitem">{props.comment.commented_by_id}</small>
                        <small> {getPostedAt(props.comment.posted_at)}</small>
                    </div>
                    <div className="content-section">
                        <p>{props.comment.comment_body}</p>
                    </div>
                    {/* <div className="commentSection">
                        {comments.length === 0 ? <div>No Comments</div> : <div>{comments}</div>}
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Comment;