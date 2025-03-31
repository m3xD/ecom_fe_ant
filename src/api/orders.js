import apiClient from './axios';

export const ordersAPI = {
    createOrder: (orderData) => {
        return apiClient.post('/orders/api/orders/', orderData);
    },

    getUserOrders: (userId) => {
        return apiClient.get(`/orders/api/orders/user_orders/?user_id=${userId}`);
    },

    getOrder: (orderId) => {
        return apiClient.get(`/orders/api/orders/${orderId}/`);
    },

    cancelOrder: (orderId) => {
        return apiClient.post(`/orders/api/orders/${orderId}/cancel/`);
    }
};

export default ordersAPI;