import { createSlice } from "@reduxjs/toolkit"

const slice = createSlice({
    name: "upvotedPosts",
    initialState: [],
    reducers: {
        updatePostUpvote: (upvotedPosts, action) => {
            const index = upvotedPosts.findIndex(post => post.postId === action.payload.postId);
            upvotedPosts[index].upvote_dir = action.payload.dir;
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