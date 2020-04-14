import React, {useState, createContext} from 'react';

export const UserContext = createContext();

export const UserProvider = props =>{
    const [user, setUser] = useState({
        user : {id : "",
        userName : "",
        email : ""},
        loggedIn : false,
        token : ""
    });

    return (
        <UserContext.Provider value={[user, setUser]}>
            {props.children}
        </UserContext.Provider>
    )
}