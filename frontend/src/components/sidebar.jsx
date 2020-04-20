import React from "react";
import { Link } from "react-router-dom";

const SideBar = (props) =>{

    return (
        <div className="sidebar-description">
            <div className="banner"><h3>About Forum App</h3></div>
            <div className="description"><p>Forum app is a shitty reddit clone, developed during global pandemic. It is developed using MERN (Mongodb, Express, React, NodeJs) stack.</p></div>
            <div className="create-post">
                <Link to="/createPost"><button>Create Post</button></Link>
            </div>
        </div>
    )
}

export default SideBar;