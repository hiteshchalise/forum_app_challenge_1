
// Action Types
const ADD_POSTS = "addPosts";

// _id: data.state.post._id,
//     post_title: data.state.post.post_title,
//         posted_by: data.state.post.posted_by,
//             posted_at: data.state.post.posted_at,
//                 post_body: data.state.post.post_body,
//                     comments: [],
//                         upvotes: data.state.post.upvotes

// Action Creators
export const addPosts = (posts) => {
    return {
        type: ADD_POSTS,
        posts: posts.map(post => ({ ...post }))
    }
};

// Reducer
const posts = (state = [], action) => {
    switch (action.type) {
        case ADD_POSTS:
            state = action.posts.map(post => ({ ...post }))
            return state;
        default:
            return state;
    }
}

export default posts;