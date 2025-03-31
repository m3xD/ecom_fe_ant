import React, { createContext, useState, useEffect } from 'react';
import { message } from 'antd';
import authAPI from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Load user from localStorage on initial render
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setCurrentUser(JSON.parse(storedUser));
            setToken(storedToken);
        }

        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await authAPI.login(credentials);
            const { user, token } = response.data;

            // Save to state
            setCurrentUser(user);
            setToken(token);

            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);

            message.success('Login successful!');
            setError(null);
            return user;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Login failed';
            setError(errorMessage);
            message.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await authAPI.register(userData);
            const { user, token } = response.data;

            // Save to state
            setCurrentUser(user);
            setToken(token);

            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);

            message.success('Registration successful!');
            setError(null);
            return user;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Registration failed';
            setError(errorMessage);
            message.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        // Clear state
        setCurrentUser(null);
        setToken(null);

        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        message.success('Logged out successfully!');
    };

    const updateProfile = async (userData) => {
        try {
            setLoading(true);
            const response = await authAPI.updateProfile(currentUser.id, userData);
            const updatedUser = response.data;

            // Update state
            setCurrentUser(updatedUser);

            // Update localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));

            message.success('Profile updated successfully!');
            return updatedUser;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to update profile';
            message.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        currentUser,
        token,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!currentUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};