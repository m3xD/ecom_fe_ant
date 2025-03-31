import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // If auth is still loading, don't render anything yet
    if (loading) {
        return null;
    }

    // If not authenticated, redirect to login with a redirect path
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // If authenticated, render the protected component
    return children;
};

export default ProtectedRoute;