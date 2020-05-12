
// Action Types
const SET_USER = "setUser";
const UNSET_USER = "unsetUser";

// Action Creators
export const userCreator = (user) => {
    console.log("UserCreator: user", user);
    return {
        type: SET_USER,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            token: user.token,
            upvoted_posts: [...user.upvoted_posts
            ]
        }
    }
};

export const userDestroyer = () => ({
    type: UNSET_USER,
})

// Reducer
const auth = (state = {}, action) => {
    console.log("Auth: state: ", state, "action: ", action);
    switch (action.type) {
        case SET_USER:
            console.log("SetUser: state: ", action.user);
            state = {
                id: action.user.id,
                name: action.user.name,
                email: action.user.email,
                token: action.user.token,
                upvoted_posts: [...action.user.upvoted_posts]
            };
            return state;
        case UNSET_USER:
            state = {
            }
            return state;
        default:
            return state;
    }
}

export default auth;