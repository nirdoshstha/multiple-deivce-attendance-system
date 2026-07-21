import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router';
import { PulseLoader } from 'react-spinners';

const PrivateRoutes = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (

            <div className="d-flex justify-content-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    return user ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoutes


// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const PrivateRoutes = () => {
//     const { token } = useAuth();

//     return token ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default PrivateRoutes;