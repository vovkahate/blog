import { useState, createContext } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const signin = (newUser, token, cb) => {
        setUser(newUser);
        setToken('fake-jwt-token');
        cb();
    };

    const signout = (cb) => {
        setUser(null);
        setToken(null);
        cb();
    };

    const value = { user, token, signin, signout };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
