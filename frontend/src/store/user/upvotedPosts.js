
const UPDATE_POST_UPVOTE = "updatePostUpvote";
const ADD_UPVOTED_POSTS = "addUpvotedPosts";


export const updatePostUpvote = (upvote) => {
    return {
        type: UPDATE_POST_UPVOTE,
        upvote: { ...upvote }
    }
}

export const addUpvotedPosts = (upvotedPosts) => {
    return {
        type: ADD_UPVOTED_POSTS,
        upvotedPosts
    };
};


const upvotedPost = (state = [], action) => {
    switch (action.type) {
        case ADD_UPVOTED_POSTS:
            state = action.upvotedPosts.map(upvotedPost => ({ ...upvotedPost }));
            return state;

        case UPDATE_POST_UPVOTE:
            state = state.map(post => post.postId === action.upvote.postId ? {
                ...post, upvote_dir: action.upvote.dir
            } : { ...post });
            return state;
        default:
            return state;
    }
}

export default upvotedPost;