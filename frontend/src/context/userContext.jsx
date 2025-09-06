import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider =({children})=>{
    let userData=null;
    userData=localStorage.getItem('userr');

    const [user,setUser]=useState(userData);

    //function to update user
    const updateUser = (userData)=>{
        setUser(userData);
    };

    //function to clear user datacons
    const clearUser=()=>{
        setUser(null);
    };

    return (
        <UserContext.Provider value={{user,updateUser,clearUser}}>
            {children}
        </UserContext.Provider> 
    );

};