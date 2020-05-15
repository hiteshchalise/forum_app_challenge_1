
// Action Types
const SET_USER = "setUser";
const UNSET_USER = "unsetUser";
const UPDATE_POST_UPVOTE = "updatePostUpvote";

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


// Reducer
const user = (state = {
    upvoted_posts: []
}, action) => {
    switch (action.type) {
        case SET_USER:
            state = {
                ...action.user,
                upvoted_posts: [...action.user.upvoted_posts]
            };
            return state;
        case UNSET_USER:
            state = {
                upvoted_posts: []
            }
            return state;
        case UPDATE_POST_UPVOTE:
            // state = state.map(post => post._id === action.upvote.postId ? { ...action.})
            state = {
                ...state,
                upvoted_posts: [...state.upvoted_posts.map(post => post.postId === action.upvote.postId ? { ...post, upvote_dir: action.upvote.dir, } : post)]
            };
            return state;
        default:
            return state;
    }
}

export default user;