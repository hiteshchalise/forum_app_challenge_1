import { combineReducers } from "redux";
import auth from "./auth";
import upvotedComments from "./upvotedComments";
import upvotedPosts from "./upvotedPosts";

export default combineReducers({
    auth,
    upvotedComments,
    upvotedPosts
})