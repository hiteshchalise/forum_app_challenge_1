import { createSlice } from "@reduxjs/toolkit"

const slice = createSlice({
    name: "auth",
    initialState: {},
    reducers: {
        userCreator: (user, action) => {
            user = action.payload
            return user;
        },
        userDestroyer: (user) => {
            user = {}
            return user;
        }
    }
})

export const { userCreator, userDestroyer } = slice.actions;
export default slice.reducer;