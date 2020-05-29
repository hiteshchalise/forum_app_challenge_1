import { createSlice } from "@reduxjs/toolkit"

const slice = createSlice({
    name: "upvotedPosts",
    initialState: [],
    reducers: {
        updatePostUpvote: (upvotedPosts, action) => {
            const upvotedPost = upvotedPosts.find(post => post.postId === action.payload.postId);
            upvotedPost.upvote_dir = action.payload.dir;
        },
        addUpvotedPosts: (upvotedPosts, action) => {
            upvotedPosts.push(...action.payload);
        },
        addUpvotedPost: (upvotedPosts, action) => {
            upvotedPosts.push(action.payload);
        }
    }
});

export const {
    updatePostUpvote,
    addUpvotedPosts,
    addUpvotedPost } = slice.actions;

export default slice.reducer;