
// Action Types
const SET_USER = "setUser";
const UNSET_USER = "unsetUser";
const UPDATE_POST_UPVOTE = "updatePostUpvote";
const UPDATE_UPVOTED_COMMENT = "updateUpvotedComment"

// Action Creators
export const userCreator = (user) => {
    return {
        type: SET_USER,
        user: {
            ...user,
            upvoted_posts: [...user.upvoted_posts]
        }
    }
};

export const userDestroyer = () => ({
    type: UNSET_USER,
})

export const updatePostUpvote = (upvote) => {
    return {
        type: UPDATE_POST_UPVOTE,
        upvote: { ...upvote }
    }
}

export const updateUpvotedComment = (upvote) => {
    return {
        type: UPDATE_UPVOTED_COMMENT,
        upvote: { ...upvote }
    }
}

// Reducer
const user = (state = {
    upvoted_posts: [],
    upvoted_comments: []
}, action) => {
    switch (action.type) {
        case SET_USER:
            state = {
                ...action.user,
                upvoted_posts: [...action.user.upvoted_posts],
                upvoted_comments: [...action.user.upvoted_comments]
            };
            return state;
        case UNSET_USER:
            state = {
                upvoted_posts: [],
                upvoted_comments: []
            }
            return state;
        case UPDATE_POST_UPVOTE:
            // state = state.map(post => post._id === action.upvote.postId ? { ...action.})
            state = {
                ...state,
                upvoted_posts: [...state.upvoted_posts.map(post => post.postId === action.upvote.postId ? { ...post, upvote_dir: action.upvote.dir, } : post)],
                upvoted_comments: [...state.upvoted_comments.map(
                    comment => ({
                        ...comment,
                        comments: [...comment.comments.map(comment => ({ ...comment }))]
                    }))]
            };
            return state;
        case UPDATE_UPVOTED_COMMENT:
            state = {
                ...state,
                upvoted_posts: [...state.upvoted_posts.map(post => ({ ...post }))],
                upvoted_comments: [
                    ...state.upvoted_comments.map(
                        upvoted_comment =>
                            upvoted_comment.postId === action.upvote.postId ?
                                {
                                    ...upvoted_comment, comments: upvoted_comment.comments.map(
                                        comment => {
                                            console.log("comment._id", comment._id, "action.upvote.commentId", action.upvote.commentId, "===", comment.commentId === action.upvote.commentId);
                                            return comment.commentId === action.upvote.commentId ?
                                                { ...comment, upvote_dir: action.upvote.dir } :
                                                comment
                                        }
                                    )
                                } : upvoted_comment
                    )
                ]
            };
            return state;
        default:
            return state;
    }
}

export default user;