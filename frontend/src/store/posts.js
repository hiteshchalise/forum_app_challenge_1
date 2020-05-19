
// Action Types
const ADD_POSTS = "addPosts";
const UPDATE_POST_BY_ID = "updatePostById";
const UPDATE_POST_UPVOTE_COUNT = "updatePostUpvoteCount";
const UPDATE_COMMENT_UPVOTE = "updateCommentUpvote";

// Action Creators
export const addPosts = (posts) => {
    return {
        type: ADD_POSTS,
        posts: posts.map(post => ({ ...post }))
    }
};

export const updatePostById = (post) => {
    return {
        type: UPDATE_POST_BY_ID,
        post: { ...post }
    }
}
export const updatePostUpvoteCount = (upvote) => {
    return {
        type: UPDATE_POST_UPVOTE_COUNT,
        upvote
    }
}

export const updateCommentUpvote = (upvote) => {
    return {
        type: UPDATE_COMMENT_UPVOTE,
        upvote: { ...upvote }
    }
}

// Reducer
const posts = (state = [], action) => {
    switch (action.type) {
        case ADD_POSTS:
            state = action.posts.map(post => ({ ...post }))
            return state;
        case UPDATE_POST_BY_ID:
            state = state.map(post => post._id === action.post._id ? { ...action.post } : post);
            return state;
        case UPDATE_POST_UPVOTE_COUNT:
            state = state.map(post => post._id === action.upvote.postId ? { ...post, upvotes: action.upvote.upvotes } : post);
            return state;
        case UPDATE_COMMENT_UPVOTE:
            state = state.map(post => post._id === action.upvote.postId ? { ...post, comments: [...post.comments.map(comment => comment._id === action.upvote.commentId ? { ...comment, upvotes: action.upvote.upvotes } : comment)] } : post)
            return state;
        default:
            return state;
    }
}

export default posts;