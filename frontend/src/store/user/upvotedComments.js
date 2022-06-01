import { createSlice } from "@reduxjs/toolkit"

const slice = createSlice({
    name: "upvotedComments",
    initialState: [],
    reducers: {
        updateUpvotedComment: (upvotedComments, action) => {
            const upvotedComment = upvotedComments.find(upvotedComment => upvotedComment.postId === action.payload.postId);
            const targetUpvotedComment = upvotedComment.comments.find(comment => comment.commentId === action.payload.commentId);
            targetUpvotedComment.upvote_dir = action.payload.dir;
        },
        addUpvotedComment: (upvotedComments, action) => {
            upvotedComments.push(action.payload);
        },
        addUpvotedComments: (upvotedComments, action) => {
            upvotedComments.push(...action.payload);
        },
        addUpvotedCommentsComment: (upvotedComments, action) => {
            const upvotedComment = upvotedComments.find(upvotedComment => upvotedComment.postId === action.payload.postID);
            upvotedComment.comments.push(action.payload);
        }
    }
});

export const {
    updateUpvotedComment,
    addUpvotedComment,
    addUpvotedComments,
    addUpvotedCommentsComment } = slice.actions;

export default slice.reducer;