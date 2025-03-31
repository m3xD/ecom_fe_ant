import apiClient from './axios';

export const paymentsAPI = {
    createPayment: (paymentData) => {
        return apiClient.post('/payments/api/payments/', paymentData);
    },

    getOrderPayment: (orderId) => {
        return apiClient.get(`/payments/api/payments/order_payment/?order_id=${orderId}`);
    },

    getUserPayments: (userId) => {
        return apiClient.get(`/payments/api/payments/user_payments/?user_id=${userId}`);
    },

    requestRefund: (paymentId) => {
        return apiClient.post(`/payments/api/payments/${paymentId}/refund/`);
    }
};

export default paymentsAPI;