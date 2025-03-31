import apiClient from './axios';

export const cartAPI = {
    getUserCart: (userId) => {
        return apiClient.get(`/cart/api/carts/user/?user_id=${userId}`);
    },

    addToCart: (cartData) => {
        return apiClient.post('/cart/api/cart-items/', cartData);
    },

    updateCartItem: (itemId, data) => {
        return apiClient.put(`/cart/api/cart-items/${itemId}/`, data);
    },

    removeCartItem: (itemId) => {
        return apiClient.delete(`/cart/api/cart-items/${itemId}/`);
    },

    clearCart: (cartId) => {
        return apiClient.delete(`/cart/api/cart-items/clear_cart/?cart_id=${cartId}`);
    }
};

export default cartAPI;