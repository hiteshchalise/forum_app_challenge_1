
// Action Types
const ADD_POSTS = "addPosts";
const UPDATE_POST_BY_ID = "updatePostById";
const UPDATE_POST_UPVOTE_COUNT = "updatePostUpvoteCount";

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
        default:
            return state;
    }
}

export default posts;