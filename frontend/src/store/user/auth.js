
// Action Types
const SET_USER = "setUser";
const UNSET_USER = "unsetUser";

// Action Creators
export const userCreator = (user) => {
    return {
        type: SET_USER,
        user: {
            ...user
        }
    }
};

export const userDestroyer = () => ({
    type: UNSET_USER,
});

// Reducer
const auth = (state = {}, action) => {
    switch (action.type) {
        case SET_USER:
            state = {
                ...action.user
            };
            return state;
        case UNSET_USER:
            state = {}
            return state;
        default:
            return state;
    }
}

export default auth;