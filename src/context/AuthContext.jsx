import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);


    const checkAuth = async () => {
        const token = localStorage.getItem("auth_token");

        if (token) {
            try {
                api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                const response = await api.get("/user");

                setUser(response.data);
            } catch (error) {
                console.log(error);

                localStorage.removeItem("auth_token");
                delete api.defaults.headers.common["Authorization"];
                setUser(null);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    const updateAuthState = (token, userData) => {
        localStorage.setItem('auth_token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
    };

    const clearAuthState = () => {
        localStorage.removeItem('auth_token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    }

    // Permission Helper
    // const can = (permission) => {
    //     if (!user) return false;
    //     return user.permissions?.includes(permission);
    // };
    const can = (permission) => {
        if (!user) return false;

        // Super Admin can do everything
        if (user.roles?.includes("Super Admin")) {
            return true;
        }

        return user.permissions?.includes(permission);
    };

    // Role Helper
    const hasRole = (role) => {

        if (!user) return false;

        return user.roles?.includes(role);

    };

    return (
        <AuthContext.Provider value={{ user, updateAuthState, loading, checkAuth, clearAuthState, can, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);

