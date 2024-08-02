import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, isLoggedIn, isAllowed }) => {
    const location = useLocation();

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    if (!isAllowed) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;
