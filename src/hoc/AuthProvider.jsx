import { useState, useEffect, createContext } from 'react';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState('');
    const [bearerToken, setBearerToken] = useState('');
    const [pic, setPic] = useState('');

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userInfo'));
        if (userData) {
            setUsername(userData.username);
            setBearerToken(userData.token);
            setPic(userData.image);
            console.log('name and token and pic:', username, bearerToken, pic);
        }
    }, []);

    const signin = (newUser, token, pic, cb) => {
        setUsername(newUser);
        setBearerToken(token);
        setPic(pic);
        console.log('signin:', newUser, token, pic);
        cb();
    };

    const signout = (cb) => {
        localStorage.removeItem('userInfo');
        setUsername('');
        setBearerToken('');
        setPic('');
        cb();
    };

    const value = { username, bearerToken, pic, signin, signout };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
