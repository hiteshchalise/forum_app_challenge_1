import { createSlice } from "@reduxjs/toolkit"

const slice = createSlice({
    name: "posts",
    initialState: [],
    reducers: {
        addPosts: (posts, action) => {
            posts = [];
            posts.push(...action.payload);
            return posts;
        },
        updatePostById: (posts, action) => {
            const index = posts.findIndex(post => post._id === action.payload._id);
            posts[index] = action.payload;
        },
        updatePostUpvoteCount: (posts, action) => {
            const index = posts.findIndex(post => post._id === action.payload.postId);
            posts[index].upvotes = action.payload.upvotes;
        },
        updateCommentUpvote: (posts, action) => {
            const postIndex = posts.findIndex(post => post._id === action.payload.postId);
            const commentIndex = posts[postIndex].comments.findIndex(comment => comment._id === action.payload.commentId);
            posts[postIndex].comments[commentIndex].upvotes = action.payload.upvotes;
        }
    }
});

export const {
    addPosts,
    updatePostById,
    updatePostUpvoteCount,
    updateCommentUpvote } = slice.actions;

export default slice.reducer;