import React from "react";
import "./style/container.css";

const Upvote = ({ upvoteDir, upvoteCount, handleClick }) => {
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