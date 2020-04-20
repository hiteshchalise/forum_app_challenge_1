import React from "react";
import { Link } from "react-router-dom";
import "./style/sidebar.css"

const SideBar = (props) => {
    return (
        <div className="sidebar-description">
            <div className="banner"><h3>About Forum App</h3></div>
            <div className="description">
                <p>Forum app is a shitty reddit clone, developed during global pandemic. It is developed using MERN (Mongodb, Express, React, NodeJs) stack.</p>
                <br/>
                <p>If you've logged in then you can create post by clicking button down below.</p>
            </div>

            <Link to="/createPost"><button>Create Post</button></Link>

        </div>
    )
}

export default SideBar;