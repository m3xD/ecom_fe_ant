import apiClient from './axios';

export const authAPI = {
    register: (userData) => {
        return apiClient.post('/users/api/users/register/', userData);
    },

    login: (credentials) => {
        return apiClient.post('/users/api/users/login/', credentials);
    },

    getCurrentUser: () => {
        return apiClient.get('/users/api/users/me/');
    },

    updateProfile: (userId, userData) => {
        return apiClient.put(`/users/api/users/${userId}/`, userData);
    },
};

export default authAPI;