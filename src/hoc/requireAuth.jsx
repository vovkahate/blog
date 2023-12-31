import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const RequireAuth = ({ children }) => {
    const { bearerToken } = useAuth();

    if (!bearerToken) {
        return <Navigate to="/sign-in" />;
    }

    return children;
};

export default RequireAuth;
