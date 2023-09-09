import { useLocation, Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
    const location = useLocation();

    const data = JSON.parse(localStorage.getItem('userInfo'));
    const token = data ? data.token : null;
    let auth = token !== null && token !== undefined;
    if (!auth) {
        return (
            <Navigate
                to="/sign-in"
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
};

export default RequireAuth;
