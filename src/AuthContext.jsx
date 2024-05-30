import React, { createContext, useState, useEffect } from 'react';
import { isAuth } from './isAuth';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const authorization = axios.defaults.headers.common["Authorization"];
        if (authorization) {
            setAuth(true);
        }else{
            setAuth(false);
        }
    }, []);
    return (
        <AuthContext.Provider value={{ auth, setAuth}}>
            {/* {children} */}
            {auth === null ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};

export default AuthContext;