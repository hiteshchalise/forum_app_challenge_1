import React, { useContext } from "react";
import { UserContext } from "../userContext";
import { Link } from "react-router-dom";
import MyEditor from "./myEditor";
import 'draft-js/dist/Draft.css';


const AddComment = (props) => {

    const [user] = useContext(UserContext);


    return (
        !user.loggedIn ?
            <div className="rounded-container flex-row" style={{ justifyContent: "space-between" }}>
                <p> You need to be logged in to comment</p>
                <div>
                    <Link className="button" style={{ marginRight: "4px" }} to="/register">Sign Up</Link>
                    <Link className="button" to="/login">Login</Link>
                </div>
            </div> :
            <div>
                <small> Comment as: {user.user.name}</small>
                {/* <input placeholder="" style={{ width: "70%" }}></input> */}
                <MyEditor className="rounded-container" />
            </div>
    )
}

export default AddComment;